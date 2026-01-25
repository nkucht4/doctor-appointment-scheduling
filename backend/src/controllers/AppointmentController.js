const appointmentService = require("../services/AppointmentService");

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body };
    appointmentData.patient_id = req.user._id || req.user.id;
    appointmentData.doctor_id = req.body.doctor_id;

    const appointment = await appointmentService.createAppointment(
      appointmentData,
      req.file?.buffer,
      req.file?.mimetype
    );

    if (!appointment) {
      return res.status(409).json({
        message: "Doctor is not available at this time",
      });
    }

    res.status(201).json({ message: "Appointment created", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error creating appointment", error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const user = req.user;

    const appointments = await appointmentService.getAppointmentsByDoctorId(doctorId, user);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const { id: patientId } = req.params;

    const appointments = await appointmentService.getAppointmentsByPatientId(patientId, req.user);

    res.status(200).json(appointments);
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.updateAppointment(req.params.id, req.body, req.user);

    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating appointment", error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await appointmentService.deleteAppointment(req.params.id, req.user);

    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error deleting appointment", error: error.message });
  }
};

exports.getAppointmentFile = async (req, res) => {
  try {
    const file = await appointmentService.getAppointmentFile(req.params.id, req.user);

    res.set("Content-Type", file.contentType);
    res.send(file.data);
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error fetching file", error: error.message });
  }
};
