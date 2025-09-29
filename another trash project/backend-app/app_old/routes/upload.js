const express = require("express");
const multer = require("multer");
const router = express.Router();
const drives = require("../config/drives.json").drives;

// Multer storage: dynamically pick destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = req.body.destination;
    // Validate destination is an allowed drive
    const allowed = drives.find(d => d.letter === dest);
    if (!allowed) dest = "uploads/";
    cb(null, allowed ? allowed.path : "uploads/");
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.get("/", (req, res) => {
  const options = drives.map(d => `<option value="${d.letter}">${d.letter}:</option>`).join("");
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>⬆️ Upload File</h1>
    <form method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required /><br/>
      <select name="destination">${options}</select><br/><br/>
      <button type="submit">Upload</button>
    </form>
    <p><a href="/">⬅ Back</a></p>
  `);
});

router.post("/", upload.single("file"), (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>✅ File Uploaded</h1>
    <p>${req.file.originalname} uploaded to ${req.body.destination}</p>
    <a href="/upload">Upload more</a> | <a href="/">Home</a>
  `);
});

module.exports = router;
