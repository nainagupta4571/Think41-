const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/departments - List all departments with product count
router.get("/", (req, res) => {
  const query = `
    SELECT d.id, d.name, COUNT(p.id) as product_count
    FROM departments d
    LEFT JOIN products p ON d.id = p.department_id
    GROUP BY d.id
    ORDER BY d.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ departments: rows });
  });
});

// GET /api/departments/:id - Get department by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid department ID" });

  db.get(`SELECT * FROM departments WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Department not found" });
    res.json({ department: row });
  });
});

// GET /api/departments/:id/products - Get products for a department
router.get("/:id/products", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) return res.status(400).json({ error: "Invalid department ID" });

  const query = `
    SELECT p.*, d.name as department_name
    FROM products p
    JOIN departments d ON p.department_id = d.id
    WHERE d.id = ?
  `;
  db.all(query, [id], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for this department" });
    }
    res.json({
      department: products[0].department_name,
      products
    });
  });
});

module.exports = router;
