const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mount departments route
const departmentsRoute = require("./routes/departments");
app.use("/api/departments", departmentsRoute);

// GET /api/products - list all products with department name
app.get("/api/products", (req, res) => {
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

// GET /api/products/:id - get product by ID
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
