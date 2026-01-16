const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/AvailabilityController");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/", authenticateToken, availabilityController.createAvailability);
router.get("/", authenticateToken, availabilityController.getAvailabilities);
router.put("/:id", authenticateToken, availabilityController.updateAvailability);
router.delete("/:id", authenticateToken, availabilityController.deleteAvailability);

module.exports = router;