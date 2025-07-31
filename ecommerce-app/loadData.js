const fs = require('fs');

const csv = require('csv-parser');    
const db= require('./db');        
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, department TEXT, image TEXT)");
const stmt = db.prepare("INSERT INTO products (name, description, price, department, image) VALUES (?, ?, ?, ?, ?)");
    fs.createReadStream('products.csv')
        .pipe(csv())
        .on('data', (row) => {
            db.run("INSERT INTO products (name, description, price, department, image) VALUES (?, ?, ?, ?, ?)", [row.name, row.description, row.price, row.department, row.image]);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
}  );                       