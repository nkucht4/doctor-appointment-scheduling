const User = require('../models/UserModel');
const Appointment = require('../models/AppointmentModel');
const Rating = require('../models/RatingModel');
const mongoose = require("mongoose");

exports.canReviewDoctor = async (req, res, next) => {
  try {
    const { id: doctorId } = req.params;
    const patientId = req.user.id;

    console.log(patientId);

    if (req.user.role !== "PATIENT") {
      return res.status(403).json({ canReview: false });
    }

    const patient = await User.findById(patientId);
    if (!patient || patient.banned) {
      return res.status(403).json({ canReview: false, msg: "Not a user"  });
    }

    /*const pastVisit = await Appointment.findOne({
      doctor_id: new mongoose.Types.ObjectId(doctorId),
      patient_id: new mongoose.Types.ObjectId(patientId),
      date: { $lt: new Date() }
    });

    if (!pastVisit) {
      return res.status(403).json({ canReview: false, msg: "No past visit" });
    }

    const existingRating = await Rating.findOne({
      doctor_id: new mongoose.Types.ObjectId(doctorId),
      patient_id: new mongoose.Types.ObjectId(patientId)
    });

    if (existingRating) {
      return res.status(403).json({ canReview: false, msg: "A rating already exists"  });
    }*/

    next();
  } catch (err) {
    console.error('canReviewDoctor error:', err);
    res.status(500).json({ canReview: false });
  }
};