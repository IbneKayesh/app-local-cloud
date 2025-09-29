const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const drives = require("../config/drives.json").drives;

module.exports = (uploadMiddleware) => {
  const router = express.Router();

  // Get list of drives
  router.get("/drives", (req, res) => {
    res.json(drives);
  });

  // Get contents of a path
  router.get("/list", (req, res) => {
    const folderPath = req.query.path;
    if (!folderPath || !fs.existsSync(folderPath)) {
      return res.status(400).json({ error: "Invalid path" });
    }

    const items = fs.readdirSync(folderPath).map(name => {
      const fullPath = path.join(folderPath, name);
      return {
        name,
        isDirectory: fs.lstatSync(fullPath).isDirectory()
      };
    });
    res.json({ path: folderPath, items });
  });

  // Download file or folder
  router.get("/download", (req, res) => {
    const targetPath = req.query.path;
    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(400).send("Invalid path");
    }

    const stat = fs.lstatSync(targetPath);

    if (stat.isDirectory()) {
      // Zip folder
      const zipName = path.basename(targetPath) + ".zip";
      res.attachment(zipName);
      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);
      archive.directory(targetPath, false);
      archive.finalize();
    } else {
      // Single file
      res.download(targetPath);
    }
  });

  // Upload to current path
  router.post("/upload", uploadMiddleware.single("file"), (req, res) => {
    res.json({ message: "File uploaded", file: req.file });
  });

  return router;
};
