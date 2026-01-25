const User = require('../models/UserModel');
const Appointment = require('../models/AppointmentModel');
const Rating = require('../models/RatingModel');
const mongoose = require("mongoose");

async function getDoctorsBasicInfo() {
  return await User.find(
    { role: 'DOCTOR' },
    'firstName lastName specialization'
  );
}

async function getUsers() {
  return await User.find({}, '-password');
}

async function canReviewDoctor(patientId, doctorId, userRole) {
  if (userRole !== "PATIENT") {
    return false;
  }

  const patient = await User.findById(patientId);
  if (!patient || patient.banned) {
    return false;
  }

  const pastVisit = await Appointment.findOne({
    doctor_id: new mongoose.Types.ObjectId(doctorId),
    patient_id: new mongoose.Types.ObjectId(patientId),
    date: { $lt: new Date() }
  });

  if (!pastVisit) {
    return false;
  }

  const existingRating = await Rating.findOne({
    doctor_id: new mongoose.Types.ObjectId(doctorId),
    patient_id: new mongoose.Types.ObjectId(patientId)
  });

  if (existingRating) {
    return false;
  }

  return true;
}

async function updateUserBanStatus(userId, banned) {
  if (typeof banned !== 'boolean') {
    const error = new Error("Pole 'banned' musi być typu boolean");
    error.status = 400;
    throw error;
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("Użytkownik nie znaleziony");
    error.status = 404;
    throw error;
  }

  user.banned = banned;
  await user.save();

  return user;
}

module.exports = {
  getDoctorsBasicInfo,
  getUsers,
  canReviewDoctor,
  updateUserBanStatus,
};
