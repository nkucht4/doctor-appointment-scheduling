const availabilityService = require("../services/AvailabilityService");

exports.createAvailability = async (req, res) => {
  try {
    const availability = await availabilityService.createAvailability(req.user, req.body);
    res.status(201).json({ message: "Availability created", availability });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.getAvailabilityByDoctorId = async (req, res) => {
  try {
    const availabilities = await availabilityService.getAvailabilityByDoctorId(req.params.id);
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.getAvailabilities = async (req, res) => {
  try {
    const availabilities = await availabilityService.getAvailabilities();
    res.status(200).json(availabilities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching availabilities", error: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const availability = await availabilityService.updateAvailability(req.user, req.params.id, req.body);
    res.status(200).json({ message: "Availability updated", availability });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

exports.deleteAvailability = async (req, res) => {
  try {
    await availabilityService.deleteAvailability(req.user, req.params.id);
    res.status(200).json({ message: "Availability deleted" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
