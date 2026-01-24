const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

router.post("/login", authController.loginUser);
router.post("/register", authController.register);
router.post("/register_doctor", authenticateToken, authorizeRole("ADMIN"), authController.registerDoctor);

module.exports = router;