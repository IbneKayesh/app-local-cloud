const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Rename file/folder
router.post("/rename", (req, res) => {
  const { path: oldPath, newName } = req.body;
  if (!oldPath || !newName) return res.json({ success: false, message: "Invalid parameters" });

  try {
    const newPath = path.join(path.dirname(oldPath), newName);
    fs.renameSync(oldPath, newPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Rename error:", err);
    res.json({ success: false, message: err.message });
  }
});

// Delete file/folder
router.post("/delete", (req, res) => {
  const { path: targetPath } = req.body;
  if (!targetPath) return res.json({ success: false, message: "Invalid path" });

  try {
    const stats = fs.statSync(targetPath);
    if (stats.isDirectory()) fs.rmSync(targetPath, { recursive: true, force: true });
    else fs.unlinkSync(targetPath);
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.json({ success: false, message: err.message });
  }
});

// Create new folder
router.post("/create-folder", (req, res) => {
  const { path: parentPath, name } = req.body;
  if (!parentPath || !name) return res.json({ success: false, message: "Invalid parameters" });

  const newFolderPath = path.join(parentPath, name);
  try {
    if (!fs.existsSync(newFolderPath)) {
      fs.mkdirSync(newFolderPath);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Folder already exists" });
    }
  } catch (err) {
    console.error("Create folder error:", err);
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
