const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const archiver = require("archiver");

const drives = require("./config/drives.json").drives;
const fileRoutes = require("./routes/files");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = 8080;

// Serve React frontend build
app.use(express.static(path.join(__dirname, "../frontend-app/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend-app/dist/index.html"));
});

// Middleware
app.use(express.json());

// Multer setup (same as before)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.query.currentPath;
    if (!uploadPath || !fs.existsSync(uploadPath)) {
      return cb(new Error("Invalid path for upload"));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// API routes
app.use("/api/files", fileRoutes(upload));
app.use("/api/files/upload", uploadRoutes(upload));

// Zip folder download
app.get("/api/files/download-folder", (req, res) => {
  const folderPath = req.query.path;
  if (!folderPath || !fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return res.status(400).send("Invalid folder path");
  }

  const folderName = path.basename(folderPath);
  res.setHeader("Content-Disposition", `attachment; filename=${folderName}.zip`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.directory(folderPath, false);
  archive.pipe(res);
  archive.finalize();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
