import { io } from "socket.io-client";

class NotificationObservable {
  constructor() {
    this.subscribers = [];
    this.socket = null;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }

  notify(data) {
    this.subscribers.forEach((cb) => cb(data));
  }

  connect(token) {
    if (this.socket) return; 

    this.socket = io("http://localhost:8080", {
        auth: { token },
    });

    this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("connect_error", (err) => {
        console.error("Socket.IO connect_error:", err.message);
    });

    this.socket.on("notification", (notification) => {
        console.log("Received notification via socket:", notification);
        this.notify(notification);
    });
    }


  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const notificationObservable = new NotificationObservable();
export default notificationObservable;
