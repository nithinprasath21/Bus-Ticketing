const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
