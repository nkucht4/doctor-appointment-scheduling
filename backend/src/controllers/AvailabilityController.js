const Availability = require("../models/AvailabilityModel");

exports.createAvailability = async (req, res) => {
  try {
    const { doctor_id, date_from, date_to, times, day_mask } = req.body;

    let assignedDoctorId;

    if (req.user.role === "DOCTOR") {
      assignedDoctorId = req.user.id;  
    } else if (req.user.role === "ADMIN") {
      if (!doctor_id) {
        return res.status(400).json({ message: "doctor_id is required for admin" });
      }
      assignedDoctorId = doctor_id;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const availability = new Availability({
      doctor_id: assignedDoctorId,
      date_from,
      date_to,
      times,
      day_mask
    });

    await availability.save();

    res.status(201).json({ message: "Availability created", availability });
  } catch (error) {
    res.status(500).json({ message: "Error creating availability", error: error.message });
  }
};


exports.getAvailabilityByDoctorId = async (req, res) => {
  try {
    const { id: doctorId } = req.params;

    const availabilities = await Availability.find({ doctor_id: doctorId });

    if (!availabilities.length) {
      return res.status(404).json({ message: "No availability found for this doctor" });
    }

    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availability", error: error.message });
  }
};


exports.getAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find({});
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availabilities", error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    delete req.body.doctor_id;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id; 
    } else if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const availability = await Availability.findOneAndUpdate(query, req.body, { new: true });

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ message: "Availability updated", availability });
  } catch (error) {
    res.status(500).json({ message: "Error updating availability", error: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    let query = { _id: id };

    if (req.user.role === "DOCTOR") {
      query.doctor_id = req.user.id; 
    } else if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const availability = await Availability.findOneAndDelete(query);

    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting availability", error: error.message });
  }
};
