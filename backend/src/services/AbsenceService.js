const Absence = require("../models/AbsenceModel");
const { removeAppointmentsDuringAbsence } = require("../utils/OverlappingUtils");

const createAbsence = async (doctorId, date_from, date_to) => {
  const removedCount = await removeAppointmentsDuringAbsence(doctorId, date_from, date_to);

  const absence = new Absence({
    doctor_id: doctorId,
    date_from,
    date_to,
  });

  await absence.save();

  return { absence, removedCount };
};

const getAbsences = async () => {
  return await Absence.find({});
};

const getAbsenceById = async (id) => {
  return await Absence.findById(id);
};

const getAbsencesByDoctorId = async (doctorId) => {
  return await Absence.find({ doctor_id: doctorId });
};

const updateAbsence = async (id, updateData, user) => {
  delete updateData.doctor_id;

  let query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const absence = await Absence.findOneAndUpdate(query, updateData, { new: true });

  if (!absence) {
    throw new Error("Absence not found");
  }

  return absence;
};

const deleteAbsence = async (id, user) => {
  let query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const absence = await Absence.findOneAndDelete(query);

  if (!absence) {
    throw new Error("Absence not found");
  }

  return absence;
};

module.exports = {
  createAbsence,
  getAbsences,
  getAbsenceById,
  getAbsencesByDoctorId,
  updateAbsence,
  deleteAbsence,
};
