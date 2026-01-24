const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

router.get("/", authenticateToken, authorizeRole("ADMIN"), userController.getUsers);
router.get("/doctors", userController.getDoctorsBasicInfo);

module.exports = router;