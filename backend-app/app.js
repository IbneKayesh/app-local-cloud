const express = require('express');
const path = require('path');

const app = express();

// Serve React build
app.use(express.static(path.join(__dirname, 'dist')));

// ✅ Catch-all (Express 5 safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
