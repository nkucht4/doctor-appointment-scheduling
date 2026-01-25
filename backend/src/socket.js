const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "doctor_app_jwt";

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

function createSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: no token"));
    }

    try {
      const userData = await verifyToken(token);

      if (userData.role !== "PATIENT") {
        return next(new Error("Authentication error: invalid role"));
      }

      socket.userId = userData.id;
      socket.join(socket.userId); 

      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
    console.log(`User connected: ${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });

    socket.on("error", (err) => {
      console.error(`Socket error from ${socket.userId}:`, err);
    });
  });

  return io;
}

module.exports = { createSocketServer };
