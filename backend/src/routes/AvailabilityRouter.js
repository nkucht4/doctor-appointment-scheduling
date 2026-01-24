const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/AvailabilityController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');

console.log("authorizeRole =", authorizeRole);

router.post("/", authenticateToken, authorizeRole("DOCTOR", "ADMIN"), availabilityController.createAvailability);
router.get("/doctor/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), availabilityController.getAvailabilityByDoctorId);
router.put("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN"), availabilityController.updateAvailability);
router.delete("/:id", authenticateToken, authorizeRole("DOCTOR", "ADMIN"), availabilityController.deleteAvailability);

module.exports = router;
