const Availability = require("../models/AvailabilityModel");
const { adjustOverlappingAvailabilities } = require("../utils/OverlappingUtils");

async function createAvailability(user, availabilityData) {
  let assignedDoctorId;

  if (user.role === "DOCTOR") {
    assignedDoctorId = user.id;
  } else if (user.role === "ADMIN") {
    if (!availabilityData.doctor_id) {
      const error = new Error("doctor_id is required for admin");
      error.status = 400;
      throw error;
    }
    assignedDoctorId = availabilityData.doctor_id;
  } else {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const newDateFrom = new Date(availabilityData.date_from);
  const newDateTo = new Date(availabilityData.date_to);

  await adjustOverlappingAvailabilities(assignedDoctorId, newDateFrom, newDateTo);

  const availability = new Availability({
    doctor_id: assignedDoctorId,
    date_from: availabilityData.date_from,
    date_to: availabilityData.date_to,
    times: availabilityData.times,
    day_mask: availabilityData.day_mask,
  });

  await availability.save();
  return availability;
}

async function getAvailabilityByDoctorId(doctorId) {
  const availabilities = await Availability.find({ doctor_id: doctorId });
  if (!availabilities.length) {
    const error = new Error("No availability found for this doctor");
    error.status = 404;
    throw error;
  }
  return availabilities;
}

async function getAvailabilities() {
  return await Availability.find({});
}

async function updateAvailability(user, id, updateData) {
  delete updateData.doctor_id;

  const query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role !== "ADMIN") {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const availability = await Availability.findOneAndUpdate(query, updateData, { new: true });

  if (!availability) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  return availability;
}

async function deleteAvailability(user, id) {
  const query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role !== "ADMIN") {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const availability = await Availability.findOneAndDelete(query);

  if (!availability) {
    const error = new Error("Availability not found");
    error.status = 404;
    throw error;
  }

  return availability;
}

module.exports = {
  createAvailability,
  getAvailabilityByDoctorId,
  getAvailabilities,
  updateAvailability,
  deleteAvailability,
};
