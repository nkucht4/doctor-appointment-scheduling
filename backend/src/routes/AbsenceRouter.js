const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/AbsenceController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

router.post("/", authenticateToken, authorizeRole("DOCTOR"), absenceController.createAbsence);
router.get("/", authenticateToken, authorizeRole("PATIENT", "DOCTOR", "ADMIN"), absenceController.getAbsences);
router.get("/doctor/:id", authenticateToken, authorizeRole("PATIENT", "DOCTOR", "ADMIN"), absenceController.getAbsencesByDoctorId);
router.get("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), absenceController.getAbsenceById);
router.put("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN"), absenceController.updateAbsence);
router.delete("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN"), absenceController.deleteAbsence);

module.exports = router;