const Notification = require("../models/NotificationModel");

let io = null;

exports.setSocketServer = (socketServer) => {
  io = socketServer;
};

exports.getAllNotificationsForUser = async (userId) => {
  return await Notification.find({ userId }).sort({ date: -1 }).limit(100);
};

exports.getUnreadCount = async (userId) => {
  return await Notification.countDocuments({
    userId,
    read: false,
  });
};

exports.markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

exports.markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, read: false },
    { $set: { read: true } }
  );
};

exports.createNotification = async (notification) => {
  const newNotification = new Notification(notification);
  await newNotification.save();
  return newNotification;
};

exports.broadcastNotification = (notification) => {
  if (!io) {
    console.warn("Brak serwera Socket.IO - nie można rozesłać powiadomienia");
    return;
  }

  const userIdStr = notification.userId.toString();
  console.log("Broadcast to userId:", userIdStr);

  io.to(userIdStr).emit("notification", notification);
};
