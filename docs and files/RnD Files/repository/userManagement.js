const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcrypt");

const DBSOURCE = path.join(__dirname, "users.db");

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error("Failed to create users table", err);
        }
      }
    );
  }
});

// Add a new user with hashed password
function addUser(username, password, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(sql, [username, hash], function (err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, username });
    });
  });
}

// Delete a user by username
function deleteUser(username, callback) {
  const sql = "DELETE FROM users WHERE username = ?";
  db.run(sql, [username], function (err) {
    if (err) return callback(err);
    callback(null, { deleted: this.changes });
  });
}

// Get user by username
function getUser(username, callback) {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

module.exports = {
  addUser,
  deleteUser,
  getUser,
  db,
};
