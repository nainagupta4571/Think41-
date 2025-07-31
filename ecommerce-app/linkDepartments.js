const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ecommerce.db');

db.serialize(() => {
  db.all(`SELECT id, department FROM products`, (err, products) => {
    if (err) return console.error(err);

    let pending = products.length;
    if (pending === 0) {
      console.log("No products found.");
      return db.close();
    }

    products.forEach(product => {
      db.get(`SELECT id FROM departments WHERE name = ?`, [product.department], (err, dept) => {
        if (err) {
          console.error(err);
        } else if (dept) {
          db.run(`UPDATE products SET department_id = ? WHERE id = ?`, [dept.id, product.id], (err) => {
            if (err) console.error(err);
            if (--pending === 0) {
              console.log("Linked products with department_id");
              db.close();
            }
          });
        } else {
          if (--pending === 0) {
            console.log("Linked products with department_id");
            db.close();
          }
        }
      });
    });
  });
});
