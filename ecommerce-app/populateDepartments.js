const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ecommerce.db'); 

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Error creating departments table:", err.message);
      } else {
        console.log("✅ Departments table created successfully.");
      }
    }
  );
});

db.close((err) => {
  if (err) {
    console.error("❌ Error closing the database:", err.message);
  } else {
    console.log("✅ Database connection closed.");
  }
});
