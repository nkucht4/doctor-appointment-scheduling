const Availability = require("../models/AvailabilityModel");

exports.createAvailability = async (req, res) => {
  try {
    const availabilityData = req.body;

    const availability = new Availability(availabilityData);
    await availability.save();

    res.status(201).json({ message: "Availability created", availability });
  } catch (error) {
    res.status(500).json({ message: "Error creating availability", error: error.message });
  }
};

exports.getAvailabilityById = async (req, res) => {
  try {
    const id = req.params.id;
    const availability = await Availability.findById(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    res.status(200).json(availability);
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
    const id = req.params.id;
    const updatedData = req.body;

    const availability = await Availability.findByIdAndUpdate(id, updatedData, { new: true });
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
    const id = req.params.id;
    const availability = await Availability.findByIdAndDelete(id);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting availability", error: error.message });
  }
};
