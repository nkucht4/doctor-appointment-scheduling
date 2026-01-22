const User = require('../models/UserModel');

exports.getDoctorsBasicInfo = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: 'DOCTOR' },
      'firstName lastName specialization'
    );
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
