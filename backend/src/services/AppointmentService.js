const Appointment = require("../models/AppointmentModel");
const notificationService = require("./NotificationService");
const { canAppointmentBeSaved } = require("../utils/OverlappingUtils")

const LIMITED_APPOINTMENT_FIELDS = {
  date: 1,
  time: 1,
  duration: 1,
};

const createAppointment = async (appointmentData, fileBuffer, fileMimetype) => {
  const canBeSaved = await canAppointmentBeSaved({
    doctorId: appointmentData.doctor_id,
    date: appointmentData.date,
    time: appointmentData.time,
    duration: appointmentData.duration,
  });

  if (!canBeSaved) {
    return null;
  }

  if (fileBuffer && fileMimetype) {
    appointmentData.file = {
      data: fileBuffer,
      contentType: fileMimetype,
    };
  }

  const appointment = new Appointment(appointmentData);
  await appointment.save();
  return appointment;
};

const getAppointments = async () => {
  return await Appointment.find({});
};

const getAppointmentsByDoctorId = async (doctorId, user) => {
  const appointments = await Appointment.find({ doctor_id: doctorId }).lean();

  return appointments.map((appt) => {
    if (user.role === "DOCTOR" && user.id === doctorId) {
      return appt;
    }

    if (user.role === "PATIENT") {
      if (String(appt.patient_id) === String(user.id)) {
        return appt;
      } else {
        const limited = {};
        Object.keys(LIMITED_APPOINTMENT_FIELDS).forEach((field) => {
          limited[field] = appt[field];
        });
        return limited;
      }
    }

    const limited = {};
    Object.keys(LIMITED_APPOINTMENT_FIELDS).forEach((field) => {
      limited[field] = appt[field];
    });
    return limited;
  });
};

const getAppointmentsByPatientId = async (patientId, user) => {
  if (user.role !== "ADMIN" && user.id !== patientId) {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  return await Appointment.find({ patient_id: patientId }).populate("doctor_id", "firstName lastName");
};

const updateAppointment = async (id, updateData, user) => {
  let query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role === "PATIENT") {
    query.patient_id = user.id;
  } else {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const appointment = await Appointment.findOneAndUpdate(query, updateData, { new: true });
  if (!appointment) {
    const error = new Error("Appointment not found");
    error.status = 404;
    throw error;
  }

  return appointment;
};

const deleteAppointment = async (id, user) => {
  let query = { _id: id };

  if (user.role === "DOCTOR") {
    query.doctor_id = user.id;
  } else if (user.role === "PATIENT") {
    query.patient_id = user.id;
  } else {
    const error = new Error("Forbidden");
    error.status = 403;
    throw error;
  }

  const appointment = await Appointment.findOneAndDelete(query);

  if (!appointment) {
    const error = new Error("Appointment not found");
    error.status = 404;
    throw error;
  }

  const savedNotification = await notificationService.createNotification({
    userId: appointment.patient_id,
    message: `Wizyta została anulowana (${new Date(appointment.date).toLocaleString()})`,
    date: new Date(),
  });

  notificationService.broadcastNotification(savedNotification);

  return appointment;
};

const getAppointmentFile = async (id, user) => {
  const appointment = await Appointment.findById(id);

  if (!appointment || !appointment.file || !appointment.file.data) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  const isDoctor = user.role === "DOCTOR" && appointment.doctor_id.toString() === user.id;
  const isPatient = user.role === "PATIENT" && appointment.patient_id.toString() === user.id;

  if (!isDoctor && !isPatient) {
    const error = new Error("Forbidden: You do not have access to this file");
    error.status = 403;
    throw error;
  }

  return appointment.file;
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentsByDoctorId,
  getAppointmentsByPatientId,
  updateAppointment,
  deleteAppointment,
  getAppointmentFile,
};
