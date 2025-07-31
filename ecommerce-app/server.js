const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /api/products → List all products (with optional pagination)
app.get("/api/products", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

 app.get('/products', (req, res) => {
  db.all(`
    SELECT products.*, departments.name AS department_name
    FROM products
    LEFT JOIN departments ON products.department_id = departments.id
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

});

// GET /api/products/:id → Get single product by ID
app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: `Product ID ${productId} not found.` });
    }
    res.status(200).json(row);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
 