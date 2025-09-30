const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const archiver = require("archiver");

const fileRoutes = require("./routes/files");
const searchRoutes = require("./routes/search");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Multer storage for dynamic currentPath
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Multer does not parse query by default, so we support both body + query
    const uploadPath = req.body.currentPath || req.query.currentPath;
    console.log("uploadPath:", uploadPath);

    if (!uploadPath || !fs.existsSync(uploadPath)) {
      return cb(new Error("Invalid path for upload"));
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes
app.use("/api/files", fileRoutes(upload));

// Zip folder download route
app.get("/api/files/download-folder", (req, res) => {
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

app.use("/api/files", searchRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`✅ LAN File Server running at http://localhost:${PORT}`);
});
