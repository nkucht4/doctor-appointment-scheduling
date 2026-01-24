const Appointment = require("../models/AppointmentModel");

const LIMITED_APPOINTMENT_FIELDS = {
  date: 1,
  time: 1,
  duration: 1
};

exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body };

    appointmentData.patient_id = req.user._id || req.user.id;

    appointmentData.doctor_id = req.body.doctor_id;

    if (req.file) {
      appointmentData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype
      };
    }

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

exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { id: doctorId } = req.params;
    const user = req.user;

    console.log("User role and id:", user?.role, user?.id);

    const appointments = await Appointment.find({ doctor_id: doctorId }).lean();

    console.log("Appointments fetched:", appointments.length);

    const result = appointments.map(appt => {
      console.log("Appointment patient_id:", appt.patient_id);
      if (user.role === "DOCTOR" && user.id === doctorId) {
        return appt;
      }

      if (user.role === "PATIENT") {
        if (String(appt.patient_id) === String(user.id)) {
          console.log("Returning full data for patient appointment");
          return appt;
        } else {
          const limited = {};
          Object.keys(LIMITED_APPOINTMENT_FIELDS).forEach(field => {
            limited[field] = appt[field];
          });
          return limited;
        }
      }

      const limited = {};
      LIMITED_APPOINTMENT_FIELDS.forEach(field => {
        limited[field] = appt[field];
      });
      return limited;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });
  }
};


exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const { id: patientId } = req.params;

    if (
      req.user.role !== "ADMIN" &&
      req.user.id !== patientId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appointments = await Appointment.find({
      patient_id: patientId
    });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });
  }
};


exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id;
    } else if (req.user.role === "PATIENT") {
      query.patient_id = req.user.id;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment updated",
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message
    });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id;
    } else if (req.user.role === "PATIENT") {
      query.patient_id = req.user.id;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const appointment = await Appointment.findOneAndDelete(query);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting appointment",
      error: error.message
    });
  }
};

exports.getAppointmentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment || !appointment.file || !appointment.file.data) {
      return res.status(404).json({ message: "File not found" });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const isDoctor = userRole === "DOCTOR" && appointment.doctor_id.toString() === userId;
    const isPatient = userRole === "PATIENT" && appointment.patient_id.toString() === userId;

    if (!isDoctor && !isPatient) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this file" });
    }

    res.set("Content-Type", appointment.file.contentType);
    res.send(appointment.file.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching file", error: error.message });
  }
};
