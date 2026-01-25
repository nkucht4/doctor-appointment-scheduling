const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const notificationService = require("./services/notificationService");

const SECRET_KEY = process.env.JWT_SECRET || "twoj_secret";

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  notificationService.setWebSocketServer(wss);

  wss.on("connection", (ws, req) => {
    try {
      const params = new URLSearchParams(req.url.replace(/^\/\?/, ""));
      const token = params.get("token");

      if (!token) {
        ws.close(4001, "Brak tokena");
        return;
      }

      const userData = jwt.verify(token, SECRET_KEY);

      if (userData.role !== "PATIENT") {
        ws.close(4003, "Brak dostępu");
        return;
      }

      ws.userId = userData.id;

      console.log(`Nowy klient WS: userId=${ws.userId}`);

      ws.on("close", () => {
        console.log(`Klient WS ${ws.userId} rozłączony`);
      });

      ws.on("error", (err) => {
        console.error(`Błąd WS klienta ${ws.userId}:`, err);
      });

    } catch (err) {
      ws.close(4002, "Nieprawidłowy token lub błąd autoryzacji");
    }
  });

  return wss;
}

module.exports = { createWebSocketServer };
