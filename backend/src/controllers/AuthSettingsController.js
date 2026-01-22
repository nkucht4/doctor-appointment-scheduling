const AuthSettings = require("../models/AuthSettings")

exports.setPersistenceMode = async (req, res) => {
  const { mode } = req.body;

  if (!["memory", "session", "local"].includes(mode)) {
    return res.status(400).json({ message: "Invalid mode" });
  }

  const settings = await AuthSettings.findOneAndUpdate(
    {},
    { persistenceMode: mode },
    { upsert: true, new: true }
  );

  res.json(settings);
};

exports.getPersistenceMode = async (req, res) => {
  const settings = await AuthSettings.findOne();
  res.json(settings || { persistenceMode: "local" });
};
