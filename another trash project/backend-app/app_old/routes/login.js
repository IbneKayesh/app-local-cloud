const express = require("express");
const router = express.Router();
const users = require("../config/users.json");

router.get("/", (req, res) => {
  res.send(`
    <link rel="stylesheet" href="/style.css">
    <h1>🔑 Login</h1>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" required /><br/>
      <input name="password" type="password" placeholder="Password" required /><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("❌ Invalid credentials <a href='/login'>Try again</a>");
  req.session.user = username;
  res.redirect("/");
});

module.exports = router;
