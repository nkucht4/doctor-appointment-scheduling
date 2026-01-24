const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/AppointmentController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/',  authenticateToken, authorizeRole("ADMIN", "PATIENT"), upload.single('file'), appointmentController.createAppointment);
router.get("/", authenticateToken, authorizeRole("ADMIN"), appointmentController.getAppointments);
router.get("/doctor/:id", authenticateToken, authorizeRole("ADMIN", "DOCTOR", "PATIENT"), appointmentController.getAppointmentsByDoctorId);
router.get("/patient/:id", authenticateToken, authorizeRole("ADMIN", "PATIENT"), appointmentController.getAppointmentsByPatientId);
router.put("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), appointmentController.updateAppointment);
router.delete("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), appointmentController.deleteAppointment);
router.get("/:id/file", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), appointmentController.getAppointmentFile);

module.exports = router;