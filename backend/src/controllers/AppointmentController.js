const Appointment = require("../models/AppointmentModel");

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointment", error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const appointments = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!appointments) {
      return res.status(404).json({ message: "Appointments not found" });
    }
    res.status(200).json({ message: "Appointments updated", appointments });
  } catch (error) {
    res.status(500).json({ message: "Error updating appointments", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointments = await Appointment.findByIdAndDelete(id);
    if (!appointments) {
      return res.status(404).json({ message: "Appointments not found" });
    }
    res.status(200).json({ message: "Appointments deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};
