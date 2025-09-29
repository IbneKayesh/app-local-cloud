const express = require("express");
const serveIndex = require("serve-index");

const app = express();
const PORT = 8080;

// Expose drives
app.use("/D", express.static("D:/"), serveIndex("D:/", { icons: true }));
app.use("/E", express.static("E:/"), serveIndex("E:/", { icons: true }));
app.use("/F", express.static("F:/"), serveIndex("F:/", { icons: true }));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
