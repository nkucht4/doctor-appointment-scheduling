const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/AvailabilityController");

router.post("/", availabilityController.createAvailability);
router.get("/", availabilityController.getAvailabilities);
router.put("/:id", availabilityController.updateAvailability);
router.delete("/:id", availabilityController.deleteAvailability);

module.exports = router;