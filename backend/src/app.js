const express = require("express");
const cors = require("cors");
const availabilityRoutes = require("./routes/AvailabilityRouter");
const absenceRoutes = require("./routes/AbsenceRouter");
const appointmentRoutes = require("./routes/AppointmentRouter");
const authRoutes = require("./routes/AuthRouter")
const authSettingsRouter = require("./routes/AuthSettingsRouter")
const userRouter = require("./routes/UserRouter")
const connectDB = require("./db");

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

const PORT = process.env.PORT || 8080; app.listen(PORT, () =>{
console.log(`Server is running on port ${PORT}.`); })

const listEndpoints = require("express-list-endpoints");

console.log(listEndpoints(app));