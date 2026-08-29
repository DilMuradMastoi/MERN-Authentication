const express = require("express");
const ensureAuthenticated = require("../Middlewares/Auth");

const router = express.Router();

// Mock database products list
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Mobile",
    price: 10000,
    category: "Electronics",
    inStock: true,
    rating: 4.5,
    brand: "Samsung",
  },
  {
    id: 2,
    name: "TV",
    price: 20000,
    category: "Electronics",
    inStock: true,
    rating: 4.2,
    brand: "Sony",
  },
  {
    id: 3,
    name: "Laptop",
    price: 50000,
    category: "Electronics",
    inStock: false,
    rating: 4.8,
    brand: "Dell",
  },
  {
    id: 4,
    name: "Headphones",
    price: 3000,
    category: "Accessories",
    inStock: true,
    rating: 4.3,
    brand: "JBL",
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 8000,
    category: "Accessories",
    inStock: true,
    rating: 4.6,
    brand: "Apple",
  },
  {
    id: 6,
    name: "Keyboard",
    price: 2500,
    category: "Accessories",
    inStock: true,
    rating: 4.1,
    brand: "Logitech",
  },
];

router.get("/", ensureAuthenticated, (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "id",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    console.log("---- Logged In User Detail ----", req.user);

    let products = [...PRODUCTS_DATA];

    // 🔍 Search by name
    if (search) {
      products = products.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 Filter by category
    if (category) {
      products = products.filter(
        (item) =>
          item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 💰 Filter minimum price
    if (minPrice && !isNaN(minPrice)) {
      products = products.filter(
        (item) => item.price >= Number(minPrice)
      );
    }

    // 💰 Filter maximum price
    if (maxPrice && !isNaN(maxPrice)) {
      products = products.filter(
        (item) => item.price <= Number(maxPrice)
      );
    }

    // 📦 Filter stock availability
    if (inStock !== undefined) {
      const stockValue = inStock === "true";

      products = products.filter(
        (item) => item.inStock === stockValue
      );
    }

    // 🔄 Sorting
    const allowedSortFields = [
      "id",
      "name",
      "price",
      "rating",
    ];

    if (allowedSortFields.includes(sortBy)) {
      products.sort((a, b) => {
        if (typeof a[sortBy] === "string") {
          return order === "desc"
            ? b[sortBy].localeCompare(a[sortBy])
            : a[sortBy].localeCompare(b[sortBy]);
        }

        return order === "desc"
          ? b[sortBy] - a[sortBy]
          : a[sortBy] - b[sortBy];
      });
    }

    // 📊 Statistics before pagination
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / Number(limit));

    const totalPrice = products.reduce(
      (sum, item) => sum + item.price,
      0
    );

    const averagePrice =
      totalItems > 0
        ? Math.round(totalPrice / totalItems)
        : 0;

    // 📄 Pagination
    const currentPage = Math.max(Number(page), 1);
    const itemsPerPage = Math.max(Number(limit), 1);

    const startIndex = (currentPage - 1) * itemsPerPage;

    const paginatedProducts = products.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    // 📂 Get all categories
    const categories = [
      ...new Set(PRODUCTS_DATA.map((item) => item.category)),
    ];

    // ✅ Response
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",

      user: {
        id: req.user?._id || req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      },

      meta: {
        totalItems,
        currentPage,
        totalPages,
        itemsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        timestamp: new Date().toISOString(),
      },

      statistics: {
        totalProducts: PRODUCTS_DATA.length,
        filteredProducts: totalItems,
        averagePrice,
      },

      filters: {
        search: search || null,
        category: category || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        inStock: inStock || null,
      },

      categories,

      data: paginatedProducts,
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