const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization:", authHeader);

    // Check Authorization header
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
        success: false,
      });
    }

    // Expected:
    // Authorization: Bearer JWT_TOKEN

    if (!authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Authorization format must be: Bearer TOKEN",
        success: false,
      });
    }

    // Extract JWT token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        message: "JWT token missing",
        success: false,
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from .env");

      return res.status(500).json({
        message: "Server authentication configuration error",
        success: false,
      });
    }

    // Verify JWT token using JWT secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    // Store authenticated user information
    req.user = decoded;

    // Continue to protected route
    next();

  } catch (error) {

    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "JWT token has expired",
        success: false,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid JWT token",
        success: false,
      });
    }

    return res.status(401).json({
      message: "Authentication failed",
      success: false,
    });
  }
};

module.exports = ensureAuthenticated;