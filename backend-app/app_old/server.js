const express = require("express");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const multer = require("multer");

const drives = require("./config/drives.json").drives;
const fileRoutes = require("./routes/files");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.body.currentPath); // Upload to current path
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Routes
app.use("/api/files", fileRoutes(upload));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
