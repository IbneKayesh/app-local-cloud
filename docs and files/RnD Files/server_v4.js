const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const config = require("./config/config.json");
const drives = require("./config/drives.json").drives;
const indexRoutes = require("./routes/index");
const loginRoutes = require("./routes/login");
const uploadRoutes = require("./routes/upload");
const authMiddleware = require("./middleware/auth");
const { getLocalIp } = require("./utils/network");

const app = express();
const PORT = config.port || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "your-secret-key", resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, "public")));

// Login route (unprotected)
app.use("/login", loginRoutes);

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Protect all routes after this
app.use(authMiddleware);

// Expose drives
drives.forEach(d => {
  app.use(`/${d.letter}`, express.static(d.path), serveIndex(d.path, { icons: true }));
  console.log(`Serving ${d.path} at http://localhost:${PORT}/${d.letter}/`);
});

// Routes
app.use("/", indexRoutes(PORT));
app.use("/upload", uploadRoutes);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n✅ File server running on http://localhost:${PORT}/`);
  console.log(`🌐 Access from LAN: http://${getLocalIp()}:${PORT}/`);
});
