const Absence = require("../models/AbsenceModel");

exports.createAbsence = async (req, res) => {
  try {
    const { date_from, date_to } = req.body;

    let doctorId;

    if (req.user.role === "DOCTOR") {
      doctorId = req.user.id;
    } 
    else {
      return res.status(403).json({ message: "Forbidden" });
    }
    const absence = new Absence({
      doctor_id: doctorId,
      date_from,
      date_to
    });

    await absence.save();

    res.status(201).json({
      message: "Absence created",
      absence
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating absence",
      error: error.message
    });
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
    const { id: doctorId } = req.params;

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
    const { id } = req.params;

    delete req.body.doctor_id;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id;
    } else if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const absence = await Absence.findOneAndUpdate(
      query,
      req.body,
      { new: true }
    );

    if (!absence) {
      return res.status(404).json({ message: "Absence not found" });
    }

    res.status(200).json({
      message: "Absence updated",
      absence
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating absence",
      error: error.message
    });
  }
};


exports.deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id;
    } else if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const absence = await Absence.findOneAndDelete(query);

    if (!absence) {
      return res.status(404).json({ message: "Absence not found" });
    }

    res.status(200).json({ message: "Absence deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting absence",
      error: error.message
    });
  }
};
