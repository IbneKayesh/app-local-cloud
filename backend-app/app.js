const express = require("express");
const path = require("path");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8085;

//CORS Origin
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:9000', 'http://localhost:5173'];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());

// Routes
const fileSystemRoutes = require("./routes/fileSystem")();
app.use("/api/filesystem", fileSystemRoutes);

// Serve React build
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Catch-all (Express 5 safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
