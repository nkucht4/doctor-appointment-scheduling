const express = require("express");
const cors = require("cors");
const http = require("http");

const availabilityRoutes = require("./routes/AvailabilityRouter");
const absenceRoutes = require("./routes/AbsenceRouter");
const appointmentRoutes = require("./routes/AppointmentRouter");
const authRoutes = require("./routes/AuthRouter")
const authSettingsRouter = require("./routes/AuthSettingsRouter")
const userRouter = require("./routes/UserRouter")
const ratingRouter =  require("./routes/RatingRouter")
const notificationsRouter = require("./routes/NotificationsRouter"); 

const connectDB = require("./db");
const { createWebSocketServer } = require("./ws");
const notificationService = require("./services/notificationService");

const app = express();
var corsOptions = { origin: "http://localhost:5173" };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/availability", availabilityRoutes);
app.use("/absence", absenceRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/auth", authRoutes);
app.use("/auth_settings", authSettingsRouter);
app.use("/users", userRouter);
app.use("/ratings", ratingRouter);
app.use("/notifications", notificationsRouter);

const server = http.createServer(app);
createWebSocketServer(server);

const PORT = process.env.PORT || 8080; 
server.listen(PORT, () =>{
console.log(`Server is running on port ${PORT}.`); })

const listEndpoints = require("express-list-endpoints");

console.log(listEndpoints(app));