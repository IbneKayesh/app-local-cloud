const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const multer = require("multer");
const unzipper = require("unzipper");

module.exports = () => {
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
      if (
        !fs.existsSync(folderPath) ||
        !fs.statSync(folderPath).isDirectory()
      ) {
        return res.status(400).json({ error: "Invalid path" });
      }

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
            path: fullPath,
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

  // --- Preview file ---
  router.get("/preview", (req, res) => {
    const filePath = req.query.path;
    if (
      !filePath ||
      !fs.existsSync(filePath) ||
      fs.statSync(filePath).isDirectory()
    ) {
      return res.status(404).send("File not found");
    }

    res.sendFile(filePath);
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

  // --- Move file/folder ---
  router.post("/move", (req, res) => {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res.status(400).json({ error: "Source and destination required" });
    }

    // Normalize path separators for Windows
    const normalizedDestination = destination.replace(/\//g, "\\");

    //console.log("normalizedDestination " + normalizedDestination);

    // Check if source and destination are the same
    if (source === normalizedDestination) {
      return res.json({ success: true, message: "No move needed" });
    }

    // Check if source exists
    if (!fs.existsSync(source)) {
      return res.status(400).json({ error: "Source does not exist" });
    }

    // Check if destination directory is valid
    const destDir = path.dirname(normalizedDestination);
    if (!fs.existsSync(destDir) || !fs.statSync(destDir).isDirectory()) {
      return res
        .status(400)
        .json({ error: "Destination directory must be valid" });
    }

    fs.rename(source, normalizedDestination, (err) => {
      if (err) {
        console.error("Move failed:", err);
        return res.status(500).json({ error: "Failed to move file/folder" });
      }
      res.json({ success: true, message: "Moved successfully" });
    });
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

  // --- Upload files / folders ---
  // Multer setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.normalize(req.query.currentPath);
      if (fs.existsSync(uploadPath) && !fs.statSync(uploadPath).isDirectory()) {
        return cb(new Error("Path is not a directory"));
      }
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 * 1024 },
  }); // 20GB limit

  // --- API setup---
  router.post("/upload", upload.single("file"), (req, res) => {
    const rawPath = req.query.currentPath;
    const currentPath = path.normalize(rawPath);

    console.log("Received upload for path:", currentPath);

    // Validation
    if (!currentPath || !fs.existsSync(currentPath)) {
      console.error("Invalid path:", currentPath);
      return res.status(400).json({ success: false, message: "Invalid path" });
    }

    if (!req.file) {
      console.error("No file uploaded.");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Save/move file if needed, currently it's stored in `uploads/`
    res.json({ success: true, file: req.file });
  });

  router.post("/uploads", upload.array("files"), (req, res) => {
    const rawPath = req.query.currentPath;
    const currentPath = path.normalize(rawPath);

    console.log("Received upload for path:", currentPath);

    // Validation
    if (!currentPath || !fs.existsSync(currentPath)) {
      console.error("Invalid path:", currentPath);
      return res.status(400).json({ success: false, message: "Invalid path" });
    }

    if (!req.files || req.files.length === 0) {
      console.error("No files uploaded.");
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Save/move file if needed, currently it's stored in `uploads/`
    res.json({ success: true, file: req.file });
  });

  // --- Search ---
  // Configurable limits
  const MAX_RESULTS = 200; // stop after 200 matches
  const MAX_DEPTH = 10; // how deep to recurse
  const MAX_TIME = 6000; // ms, 6 seconds timeout

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
      timeLimit: Date.now() - startTime > MAX_TIME,
    });
  });

  // Zip folder
  router.post("/zip", (req, res) => {
    const folderPath = req.body.path;
    if (
      !folderPath ||
      !fs.existsSync(folderPath) ||
      !fs.statSync(folderPath).isDirectory()
    ) {
      return res.status(400).json({ error: "Invalid folder path" });
    }

    const zipName = path.basename(folderPath) + ".zip";
    const zipPath = path.join(path.dirname(folderPath), zipName);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.json({ success: true, zipPath });
    });

    output.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

    archive.on("error", (err) => {
      res.status(500).json({ error: err.message });
    });

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });

  // Unzip folder
  router.post("/unzip", async (req, res) => {
    const { zipPath, destination } = req.body;

    if (!zipPath || !fs.existsSync(zipPath)) {
      return res.status(400).json({ error: "Invalid zip path" });
    }

    if (
      !destination ||
      !fs.existsSync(destination) ||
      !fs.statSync(destination).isDirectory()
    ) {
      return res.status(400).json({ error: "Invalid destination" });
    }

    try {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: destination }))
        .on("close", () => {
          res.json({ success: true });
        })
        .on("error", (err) => {
          console.error("Unzip error:", err);
          res.status(500).json({ error: "Failed to unzip" });
        });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
