require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

// Routes
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");

// Force DNS resolution for MongoDB Atlas SRV
dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const app = express();

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

// ===============================
// Content Security Policy
// ===============================

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:;"
  );

  next();
});

// ===============================
// Basic Routes
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is Running!",
    success: true,
  });
});

app.get("/ping", (req, res) => {
  res.status(200).send("PONG");
});

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// ===============================
// API Routes
// ===============================

app.use("/api/auth", AuthRouter);

app.use("/api/products", ProductRouter);

// ===============================
// 404 Handler
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    path: req.originalUrl,
  });
});

// ===============================
// Error Handler
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
    success: false,
    error: err.message,
  });
});

// ===============================
// Server + MongoDB
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    if (!process.env.MONGO_CONN) {
      throw new Error(
        "MONGO_CONN is missing from your .env file"
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing from your .env file"
      );
    }

    const conn = await mongoose.connect(
      process.env.MONGO_CONN
    );

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "Database/Server startup error:",
      error.message
    );

    process.exit(1);
  }
};

startServer();