const express = require("express");
const router = express.Router();
const authController = require('../controllers/AuthSettingsController')
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

router.post("/", authenticateToken, 
    authorizeRole("ADMIN"), 
    authController.setPersistenceMode);
router.get("/", authController.getPersistenceMode);

module.exports = router;