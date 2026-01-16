const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/AppointmentController");
const authenticateToken = require('../middleware/authMiddleware');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/',  authenticateToken, upload.single('file'), appointmentController.createAppointment);
router.get("/", authenticateToken, appointmentController.getAppointments);
router.get("/:id", authenticateToken, appointmentController.getAppointmentById);
router.put("/:id", authenticateToken, appointmentController.updateAppointment);
router.delete("/:id", authenticateToken, appointmentController.deleteAppointment);
router.get("/:id/file", authenticateToken, appointmentController.getAppointmentFile);

module.exports = router;