const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Configurable limits
const MAX_RESULTS = 200;   // stop after 200 matches
const MAX_DEPTH = 10;       // how deep to recurse
const MAX_TIME = 6000;     // ms, 6 seconds timeout

function searchFiles(dir, query, results, depth, startTime) {
  if (results.length >= MAX_RESULTS) return;
  if (depth > MAX_DEPTH) return;
  if (Date.now() - startTime > MAX_TIME) return; // timeout safeguard

  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // skip folders without permission
  }

  for (const item of items) {
    if (results.length >= MAX_RESULTS) break;

    const itemPath = path.join(dir, item.name);

    if (item.name.toLowerCase().includes(query.toLowerCase())) {
      try {
        const stats = fs.statSync(itemPath);
        results.push({
          name: item.name,
          path: itemPath,
          isDirectory: item.isDirectory(),
          size: item.isDirectory() ? 0 : stats.size,
          mtime: stats.mtime,
        });
      } catch {
        // ignore errors
      }
    }

    if (item.isDirectory()) {
      searchFiles(itemPath, query, results, depth + 1, startTime);
    }
  }
}

router.get("/search", (req, res) => {
  const { path: basePath, query } = req.query;

  if (!basePath || !fs.existsSync(basePath)) {
    return res.status(400).json({ success: false, message: "Invalid path" });
  }
  if (!query) {
    return res.status(400).json({ success: false, message: "Missing query" });
  }

  const results = [];
  const startTime = Date.now();

  searchFiles(basePath, query, results, 0, startTime);

  res.json({
    success: true,
    items: results,
    limitReached: results.length >= MAX_RESULTS,
    timeLimit: Date.now() - startTime > MAX_TIME
  });
});

module.exports = router;