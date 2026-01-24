const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/RatingController");
const { authenticateToken } = require('../middleware/AuthMiddleware');
const { authorizeRole } = require('../middleware/AuthorizeRoleMiddleware');
const { canReviewDoctor } = require('../middleware/CommentMiddleware')

router.get("/doctor/:doctorId", authenticateToken, authorizeRole("DOCTOR", "ADMIN", "PATIENT"), ratingController.getRatingsByDoctorId);
router.post("/", authenticateToken, authorizeRole("PATIENT"), canReviewDoctor, ratingController.postRating);
router.delete("/:id", authenticateToken, authorizeRole("ADMIN", "PATIENT"), ratingController.deleteRating);

module.exports = router;
