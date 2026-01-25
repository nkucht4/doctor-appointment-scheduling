const Notification = require("../models/NotificationModel");
const WebSocket = require("ws");

let wss = null; 

exports.setWebSocketServer = (webSocketServer) => {
  wss = webSocketServer;
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
  if (!wss) {
    console.warn("Brak serwera WebSocket - nie można rozesłać powiadomienia");
    return;
  }

  const message = JSON.stringify(notification);

  try {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.userId === notification.userId) {
        client.send(message);
      }
    });
  } catch (err) {
    console.error("Błąd podczas broadcastowania powiadomienia:", err);
  }
};
