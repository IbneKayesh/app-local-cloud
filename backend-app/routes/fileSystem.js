const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

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

  // --- Download single file ---
  router.get("/download", (req, res) => {
    const filePath = req.query.path;
    if (
      !filePath ||
      !fs.existsSync(filePath) ||
      fs.statSync(filePath).isDirectory()
    ) {
      return res.status(400).send("Invalid file path");
    }

    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).send("Failed to download file");
      }
    });
  });

  // --- Download Zip folder ---
  router.get("/download-folder", (req, res) => {
    const folderPath = req.query.path;
    if (
      !folderPath ||
      !fs.existsSync(folderPath) ||
      !fs.statSync(folderPath).isDirectory()
    ) {
      return res.status(400).send("Invalid folder path");
    }

    const folderName = path.basename(folderPath);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${folderName}.zip`
    );
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.directory(folderPath, false);
    archive.pipe(res);
    archive.finalize();
  });

  // --- Rename file/folder ---
  router.post("/rename", (req, res) => {


    //console.log("req.body" + JSON.stringify(req.body))

    const { path: oldPath, newName } = req.body;
    if (!oldPath || !newName)
      return res.json({ success: false, message: "Invalid parameters" });

    try {
      const newPath = path.join(path.dirname(oldPath), newName);
      fs.renameSync(oldPath, newPath);
      res.json({ success: true });
    } catch (err) {
      console.error("Rename error:", err);
      res.json({ success: false, message: err.message });
    }
  });

  // --- Delete file/folder ---
  router.post("/delete", (req, res) => {
    const { path: targetPath } = req.body;
    if (!targetPath)
      return res.json({ success: false, message: "Invalid path" });

    try {
      const stats = fs.statSync(targetPath);
      if (stats.isDirectory())
        fs.rmSync(targetPath, { recursive: true, force: true });
      else fs.unlinkSync(targetPath);
      res.json({ success: true });
    } catch (err) {
      console.error("Delete error:", err);
      res.json({ success: false, message: err.message });
    }
  });

  // --- Create new folder ---
  router.post("/create-folder", (req, res) => {
    const { path: parentPath, name } = req.body;
    if (!parentPath || !name)
      return res.json({ success: false, message: "Invalid parameters" });

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
  return router;
};
