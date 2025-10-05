const express = require("express");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Example: /download?path=D:/MyFolder
router.get("/", (req, res) => {
  const folderPath = req.query.path;
  if (!folderPath || !fs.existsSync(folderPath)) {
    return res.status(400).send("Invalid folder path");
  }

  const zipName = path.basename(folderPath) + ".zip";
  res.attachment(zipName);

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.pipe(res);
  archive.directory(folderPath, false);
  archive.finalize();
});

module.exports = router;
