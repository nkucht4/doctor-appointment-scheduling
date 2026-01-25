const authService = require("../services/AuthService");

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const doctor = await authService.registerDoctor(req.body);
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { accessToken, user } = await authService.loginUser(req.body);
    res.json({ accessToken, user });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};
