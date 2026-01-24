const Rating = require("../models/RatingModel");

exports.getRatingsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const ratings = await Rating.find({ doctor_id: doctorId })
      .populate("patient_id", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings" });
  }
};

exports.postRating = async (req, res) => {
  try {
    const { doctor_id, rating, comment } = req.body;
    const patient_id = req.user.id;

    if (!doctor_id || !rating) {
      return res.status(400).json({ message: "Doctor ID and rating are required" });
    }

    const newRating = new Rating({
      doctor_id,
      patient_id,
      rating,
      comment,
    });

    await newRating.save();

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error posting rating" });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = req.user;

    const rating = await Rating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (user.role !== "ADMIN" && rating.patient_id.toString() !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Rating.findByIdAndDelete(id);

    res.status(200).json({ message: "Rating deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting rating" });
  }
};
