const express = require("express");
const fs = require("fs");

module.exports = (upload) => {
  //console.log("upload " + upload)

  const router = express.Router();

  router.post("/", upload.single("file"), (req, res) => {
    const currentPath = req.body.currentPath;

    for (const [key, value] of req.body.entries()) {
      console.log(key, value);
    }

    if (!currentPath || !fs.existsSync(currentPath)) {
      return res.status(400).json({ success: false, message: "Invalid path" });
    }

    res.json({ success: true, file: req.file });
  });

  return router;
};
