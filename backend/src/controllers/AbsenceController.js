const absenceService = require("../services/AbsenceService");

exports.createAbsence = async (req, res) => {
  try {
    if (req.user.role !== "DOCTOR") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { date_from, date_to } = req.body;
    const doctorId = req.user.id;

    const { absence, removedCount } = await absenceService.createAbsence(doctorId, date_from, date_to);

    res.status(201).json({
      message: "Absence created",
      absence,
      removedAppointmentsCount: removedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating absence", error: error.message });
  }
};

exports.getAbsences = async (req, res) => {
  try {
    const absences = await absenceService.getAbsences();
    res.status(200).json(absences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching absences", error: error.message });
  }
};

exports.getAbsenceById = async (req, res) => {
  try {
    const absence = await absenceService.getAbsenceById(req.params.id);
    if (!absence) {
      return res.status(404).json({ message: "Absence not found" });
    }
    res.status(200).json(absence);
  } catch (error) {
    res.status(500).json({ message: "Error fetching absence", error: error.message });
  }
};

exports.getAbsencesByDoctorId = async (req, res) => {
  try {
    const absences = await absenceService.getAbsencesByDoctorId(req.params.id);
    if (!absences.length) {
      return res.status(404).json({ message: "No absences found for this doctor" });
    }
    res.status(200).json(absences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching absences", error: error.message });
  }
};

exports.updateAbsence = async (req, res) => {
  try {
    const absence = await absenceService.updateAbsence(req.params.id, req.body, req.user);
    res.status(200).json({ message: "Absence updated", absence });
  } catch (error) {
    if (error.message === "Forbidden") {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "Absence not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error updating absence", error: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    await absenceService.deleteAbsence(req.params.id, req.user);
    res.status(200).json({ message: "Absence deleted" });
  } catch (error) {
    if (error.message === "Forbidden") {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "Absence not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error deleting absence", error: error.message });
  }
};
