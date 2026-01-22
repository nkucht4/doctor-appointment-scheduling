const Absence = require("../models/AbsenceModel");

exports.createAbsence = async (req, res) => {
  try {
    const absenceData = req.body;

    const absence = new Absence(absenceData);
    await absence.save();

    res.status(201).json({ message: "Absence created", absence });
  } catch (error) {
    res.status(500).json({ message: "Error creating absence", error: error.message });
  }
};

exports.getAbsences = async (req, res) => {
  try {
    const absences = await Absence.find({});
    res.status(200).json(absences);
  } catch (error) {
    res.status(500).json({ message: "Error fetching absences", error: error.message });
  }
};

exports.getAbsenceById = async (req, res) => {
  try {
    const id = req.params.id;
    const absence = await Absence.findById(id);
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
    const { doctorId } = req.params;

    const absences = await Absence.find({ doctor_id: doctorId });

    if (!absences.length) {
      return res.status(404).json({ message: "No absences found for this doctor" });
    }

    res.status(200).json(absences);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching absences",
      error: error.message
    });
  }
};

exports.updateAbsence = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    const absences = await Absence.findByIdAndUpdate(id, updatedData, { new: true });
    if (!absences) {
      return res.status(404).json({ message: "Absences not found" });
    }
    res.status(200).json({ message: "Absences updated", absences });
  } catch (error) {
    res.status(500).json({ message: "Error updating absences", error: error.message });
  }
};

exports.deleteAbsence = async (req, res) => {
  try {
    const id = req.params.id;
    const absences = await Absence.findByIdAndDelete(id);
    if (!absences) {
      return res.status(404).json({ message: "Absences not found" });
    }
    res.status(200).json({ message: "Absences deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting absence", error: error.message });
  }
};
