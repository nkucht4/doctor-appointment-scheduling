const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/NotificationsController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

router.get("/", authenticateToken, authorizeRole("PATIENT"), notificationsController.getNotifications);
router.get("/unread-count", authenticateToken, authorizeRole("PATIENT"), notificationsController.getUnreadCount);
router.patch("/:id/read", authenticateToken, authorizeRole("PATIENT"), notificationsController.markNotificationAsRead);
router.patch("/read-all", authenticateToken, authorizeRole("PATIENT"), notificationsController.markAllAsRead);

module.exports = router;
