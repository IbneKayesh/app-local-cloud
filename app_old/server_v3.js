const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");

const config = require("./config/drives.json");
const indexRoutes = require("./routes/index");
const { getLocalIp } = require("./utils/network");

const settings = require("./config/config.json");

const app = express();

const PORT = settings.port || 8080;

// Serve static files (CSS, logos, etc.)
app.use(express.static(path.join(__dirname, "public")));

const auth = require("./middleware/auth");
// Protect homepage & drives
app.use(auth);

// Expose drives dynamically
config.drives.forEach(d => {
  app.use(`/${d.letter}`, express.static(d.path), serveIndex(d.path, { icons: true }));
  console.log(`Serving ${d.path} at http://localhost:${PORT}/${d.letter}/`);
});

// Homepage
app.use("/", indexRoutes(PORT));

const uploadRoutes = require("./routes/upload");
app.use("/upload", uploadRoutes);

const downloadRoutes = require("./routes/download");
app.use("/download", downloadRoutes);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ File server running on http://localhost:${PORT}/`);
  console.log(`🌐 Access from LAN: http://${getLocalIp()}:${PORT}/`);
});
