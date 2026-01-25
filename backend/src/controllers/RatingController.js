const ratingService = require("../services/RatingService");

exports.getRatingsByDoctorId = async (req, res) => {
  try {
    const ratings = await ratingService.getRatingsByDoctorId(req.params.doctorId);
    res.status(200).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || "Error fetching ratings" });
  }
};

exports.postRating = async (req, res) => {
  try {
    const rating = await ratingService.postRating(req.user, req.body);
    res.status(201).json(rating);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || "Error posting rating" });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    await ratingService.deleteRating(req.user, req.params.id);
    res.status(200).json({ message: "Rating deleted" });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || "Error deleting rating" });
  }
};
