const express = require("express");

const { signup, login } = require("../Controllers/AuthController");

const {
  SignupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");

const router = express.Router();

console.log("signup:", typeof signup);
console.log("login:", typeof login);
console.log("SignupValidation:", typeof SignupValidation);
console.log("loginValidation:", typeof loginValidation);

router.post("/signup", SignupValidation, signup);

router.post("/login", loginValidation, login);

module.exports = router;