const express = require("express");
const router = express.Router();
const config = require("../config/drives.json");
const { getLocalIp } = require("../utils/network");

module.exports = (PORT) => {
  router.get("/", (req, res) => {
    let links = config.drives
      .map(d => `<li><a href="/${d.letter}/">Drive ${d.letter}</a></li>`)
      .join("");

    res.send(`
      <link rel="stylesheet" href="/style.css">
      <h1>📂 LAN File Server</h1>
      <p>Access on LAN: <b>http://${getLocalIp()}:${PORT}/</b></p>
      <ul>${links}</ul>
      <p><a href="/upload">⬆️ Upload File</a></p>
      <p><a href="/logout">🚪 Logout</a></p>
    `);
  });

  return router;
};
