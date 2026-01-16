const express = require("express");
const router = express.Router();
const absenceController = require("../controllers/AbsenceController");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/", authenticateToken, absenceController.createAbsence);
router.get("/", authenticateToken, absenceController.getAbsences);
router.get("/:id", authenticateToken, absenceController.getAbsenceById);
router.put("/:id", authenticateToken, absenceController.updateAbsence);
router.delete("/:id", authenticateToken, absenceController.deleteAbsence);

module.exports = router;