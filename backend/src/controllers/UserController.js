const User = require('../models/UserModel');
const Appointment = require('../models/AppointmentModel');
const Rating = require('../models/RatingModel');
const mongoose = require("mongoose");

exports.getDoctorsBasicInfo = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: 'DOCTOR' },
      'firstName lastName specialization'
    );
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.canReviewDoctor = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const patientId = req.user.id;

    if (req.user.role !== "PATIENT") {
      return res.status(403).json({ canReview: false });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.banned) {
      return res.json({ canReview: false });
    }

    const pastVisit = await Appointment.findOne({
      doctor_id: new mongoose.Types.ObjectId(doctorId),
      patient_id: new mongoose.Types.ObjectId(patientId),
      date: { $lt: new Date() }
    });

    if (!pastVisit) {
      return res.json({ canReview: false });
    }

    const existingRating = await Rating.findOne({
      doctor_id: new mongoose.Types.ObjectId(doctorId),
      patient_id: new mongoose.Types.ObjectId(patientId)
    });

    if (existingRating) {
      return res.json({ canReview: false });
    }

    res.json({ canReview: true });
  } catch (err) {
    console.error('canReviewDoctor error:', err);
    res.status(500).json({ canReview: false });
  }
};

exports.updateUserBanStatus = async (req, res) => {
  try {
    const { id: userId } = req.params;  
    const { banned } = req.body; 

    if (typeof banned !== 'boolean') {
      return res.status(400).json({ message: "Pole 'banned' musi być typu boolean" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    user.banned = banned;
    await user.save();

    res.status(200).json({ message: `Status bana ustawiony na ${banned}`, user });
  } catch (error) {
    console.error('updateUserBanStatus error:', error);
    res.status(500).json({ message: "Błąd serwera podczas aktualizacji statusu bana" });
  }
};
