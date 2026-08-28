const express = require("express");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = express.Router();

// Mock database products list
const PRODUCTS_DATA = [
  { id: 1, name: "Mobile", price: 10000, category: "Electronics", inStock: true },
  { id: 2, name: "TV", price: 20000, category: "Electronics", inStock: true },
  { id: 3, name: "Laptop", price: 50000, category: "Electronics", inStock: false },
  { id: 4, name: "Headphones", price: 3000, category: "Accessories", inStock: true },
];

router.get("/", ensureAuthenticated, (req, res) => {
  try {
    const { search, limit } = req.query;

    console.log("---- Logged In User Detail ----", req.user);

    // 1. Filtering & Searching Feature
    let products = [...PRODUCTS_DATA];
    if (search) {
      products = products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 2. Pagination / Limit Feature
    if (limit && !isNaN(limit)) {
      products = products.slice(0, parseInt(limit));
    }

    // 3. Structured Rich Response payload
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      user: {
        id: req.user?._id || req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      },
      meta: {
        totalItems: products.length,
        timestamp: new Date().toISOString(),
      },
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching products",
      error: error.message,
    });
  }
});

module.exports = router;