const express = require("express");
const { registerUser } = require("../controllers/authController");

const router = express.Router();

// rota para registrar usuario
router.post("/register", registerUser);

module.exports = router;
