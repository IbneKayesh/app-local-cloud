const express = require("express");
const { addUser, deleteUser, getUser, db } = require("../repository/userManagement");

const router = express.Router();

// Get all users
router.get("/", (req, res) => {
  const sql = "SELECT id, username, created_at FROM users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json(rows);
  });
});

// Add user
router.post("/add", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password required" });
  }
  addUser(username, password, (err, user) => {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({ success: false, message: "Username already exists" });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, user });
  });
});

// Delete user
router.post("/delete", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: "Username required" });
  }
  deleteUser(username, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (result.deleted === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted" });
  });
});

module.exports = router;
