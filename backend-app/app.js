const express = require("express");
const path = require("path");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 7071;
const HOST = "0.0.0.0";

// Timeout for large uploads
app.set('timeout', 24 * 60 * 60 * 1000);

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "localhost";
}
const localIp = getLocalIp();

// CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://192.168.0.129:7070", "http://localhost:7070", `http://${localIp}:${PORT}`];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
}));

// JSON middleware
app.use(express.json());

// API routes
const fileSystemRoutes = require("./routes/fileSystem")();
app.use("/api/filesystem", fileSystemRoutes);


// ------------------------
// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on:`);
  console.log(` → Local:  http://localhost:${PORT}`);
  console.log(` → LAN:    http://${localIp}:${PORT}`);
});
