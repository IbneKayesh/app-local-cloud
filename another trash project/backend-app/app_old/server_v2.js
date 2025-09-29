const express = require("express");
const serveIndex = require("serve-index");
const os = require("os");

const app = express();
const PORT = 8080;

// Function to expose a drive
function exposeDrive(letter) {
  const path = `${letter}:/`;
  app.use(`/${letter}`, express.static(path), serveIndex(path, { icons: true }));
  console.log(`Serving ${path} at http://localhost:${PORT}/${letter}/`);
}

// Expose D, E, F drives
["D", "E", "F"].forEach(exposeDrive);

// Helper: get local IP for LAN access
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
}

// Homepage
app.get("/", (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>📂 LAN File Server</h1>
    <p>Access on LAN: <b>http://${getLocalIp()}:${PORT}/</b></p>
    <ul>
      <li><a href="/D/">Drive D:</a></li>
      <li><a href="/E/">Drive E:</a></li>
      <li><a href="/F/">Drive F:</a></li>
    </ul>
  `);
});

// CSS styling
app.get("/style.css", (req, res) => {
  res.type("text/css").send(`
    body { font-family: Arial, sans-serif; background:#f4f4f9; color:#333; padding:20px; }
    h1 { color:#0078d7; }
    a { text-decoration:none; color:#0078d7; font-weight:bold; }
    a:hover { text-decoration:underline; }
    ul { list-style:none; padding:0; }
    li { margin:6px 0; }
  `);
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ File server running on http://localhost:${PORT}/`);
  console.log(`🌐 Access from LAN: http://${getLocalIp()}:${PORT}/`);
});
