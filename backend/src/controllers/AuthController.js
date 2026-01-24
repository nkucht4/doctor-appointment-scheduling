const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

const ACCESS_TOKEN_TTL = "1d";   

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "PATIENT"
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };

  const accessToken = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role 
  },
  JWT_SECRET,
  { expiresIn: ACCESS_TOKEN_TTL }
);

  res.json({
    accessToken,
    user: payload
  });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialization } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specialization: specialization || "",
      role: "DOCTOR"
    });

    await doctor.save();

    return res.status(201).json({ message: "Doctor registered successfully" });

  } catch (error) {
    console.error("Error registering doctor:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


