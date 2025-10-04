const express = require("express");
const path = require("path");
const cors = require("cors");
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8085;
const HOST = "0.0.0.0";

// Set server timeout for large file uploads (24 hours to handle very slow uploads)
app.set('timeout', 24 * 60 * 60 * 1000);

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}
const localIp = getLocalIp();

//CORS Origin
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://192.168.0.129:5173", "http://localhost:5173", localIp];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Middleware
app.use(express.json());

// Routes
const fileSystemRoutes = require("./routes/fileSystem")();
const userRoutes = require("./routes/userRoutes");

app.use("/api/filesystem", fileSystemRoutes);
app.use("/api/users", userRoutes);

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Catch-all (Express 5 safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on:`);
  console.log(` → Local:  http://localhost:${PORT}`);
  console.log(` → LAN:    http://${localIp}:${PORT}`);
});
