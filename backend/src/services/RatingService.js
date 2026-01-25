const Rating = require("../models/RatingModel");

async function getRatingsByDoctorId(doctorId) {
  return await Rating.find({ doctor_id: doctorId })
    .populate("patient_id", "firstName lastName")
    .sort({ createdAt: -1 });
}

async function postRating(user, { doctor_id, rating, comment }) {
  if (!doctor_id || !rating) {
    const error = new Error("Doctor ID and rating are required");
    error.status = 400;
    throw error;
  }

  const newRating = new Rating({
    doctor_id,
    patient_id: user.id,
    rating,
    comment,
  });

  await newRating.save();

  return newRating;
}

async function deleteRating(user, ratingId) {
  const rating = await Rating.findById(ratingId);
  if (!rating) {
    const error = new Error("Rating not found");
    error.status = 404;
    throw error;
  }

  if (user.role !== "ADMIN" && rating.patient_id.toString() !== user.id) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  await Rating.findByIdAndDelete(ratingId);
}

module.exports = {
  getRatingsByDoctorId,
  postRating,
  deleteRating,
};
