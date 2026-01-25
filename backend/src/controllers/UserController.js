const userService = require('../services/UserService');

exports.getDoctorsBasicInfo = async (req, res) => {
  try {
    const doctors = await userService.getDoctorsBasicInfo();
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.canReviewDoctor = async (req, res) => {
  try {
    const canReview = await userService.canReviewDoctor(req.user.id, req.params.id, req.user.role);
    res.json({ canReview });
  } catch (err) {
    console.error('canReviewDoctor error:', err);
    res.status(500).json({ canReview: false });
  }
};

exports.updateUserBanStatus = async (req, res) => {
  try {
    const user = await userService.updateUserBanStatus(req.params.id, req.body.banned);
    res.status(200).json({ message: `Status bana ustawiony na ${user.banned}`, user });
  } catch (error) {
    console.error('updateUserBanStatus error:', error);
    res.status(error.status || 500).json({ message: error.message || "Błąd serwera podczas aktualizacji statusu bana" });
  }
};
