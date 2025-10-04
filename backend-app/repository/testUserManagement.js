const { addUser, deleteUser, getUser, db } = require("./userManagement");

// Test adding a user
addUser("testuser", "password123", (err, user) => {
  if (err) {
    console.error("Add user error:", err.message);
  } else {
    console.log("User added:", user);
  }

  // Test getting the user
  getUser("testuser", (err, user) => {
    if (err) {
      console.error("Get user error:", err.message);
    } else {
      console.log("User fetched:", user);
    }

    // Test deleting the user
    deleteUser("testuser", (err, result) => {
      if (err) {
        console.error("Delete user error:", err.message);
      } else {
        console.log("User deleted:", result);
      }

      // Close DB connection
      db.close();
    });
  });
});
