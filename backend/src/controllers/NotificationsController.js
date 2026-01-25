const notificationService = require("../services/notificationService");

exports.getNotifications = async (req, res) => {
  const userId = req.user.id;

  const notifications = await notificationService.getAllNotificationsForUser(userId);

  res.json(notifications);
};

exports.getUnreadCount = async (req, res) => {
  const userId = req.user.id;

  const count = await notificationService.getUnreadCount(userId);
  res.json({ count });
};

exports.markNotificationAsRead = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const notification = await notificationService.markAsRead(id, userId);

  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }

  res.json(notification);
};

exports.markAllAsRead = async (req, res) => {
  const userId = req.user.id;

  await notificationService.markAllAsRead(userId);
  res.status(204).end();
};

