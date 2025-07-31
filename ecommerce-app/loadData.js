const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      department TEXT,
      image TEXT
    )
  `);

  fs.createReadStream('products.csv')
    .pipe(csv())
    .on('data', (row) => {
      const stmt = db.prepare(`
        INSERT INTO products (name, description, price, department, image)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        row.name,
        row.brand, // using brand as description
        parseFloat(row.retail_price),
        row.department,
        '' // image is empty or you can set a default
      );

      stmt.finalize();
    })
    .on('end', () => {
      console.log('CSV file successfully processed and data inserted into the database.');
    });
});
