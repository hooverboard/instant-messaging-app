const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// rota para registrar usuario
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
