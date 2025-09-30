const express = require("express");
const fs = require("fs");
const path = require("path");

module.exports = (upload) => {
  const router = express.Router();

  // --- drives list ---
  router.get("/drives", (req, res) => {
    const drives = require("../config/diskette.json").drives;
    res.json(drives);
  });

  // --- List folder contents ---
  router.get("/list", (req, res) => {
    let folderPath = req.query.path;

    //console.log("folderPath " + JSON.stringify(folderPath))


    if (!folderPath) return res.status(400).json({ error: "Path is required" });

    folderPath = folderPath.replace(/\/+$/, ""); // remove trailing slash

    try {
      const hiddenFolders = ["System Volume Information", "$RECYCLE.BIN"];

      const items = fs
        .readdirSync(folderPath)
        .filter(
          (name) => !name.startsWith(".") && !hiddenFolders.includes(name)
        )
        .map((name) => {
          const fullPath = path.join(folderPath, name);
          const stats = fs.statSync(fullPath);
          return {
            name,
            isDirectory: stats.isDirectory(),
            size: stats.size,
            mtime: stats.mtime,
          };
        });

      res.json({ items });
    } catch (err) {
      console.error("List folder error:", err);
      res.status(500).json({ error: "Failed to read folder" });
    }
  });

  return router;
};
