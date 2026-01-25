const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const ACCESS_TOKEN_TTL = "1d";

async function registerUser({ firstName, lastName, email, password }) {
  if (!firstName || !lastName || !email || !password) {
    const error = new Error("Please fill all required fields");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "PATIENT",
  });

  await user.save();

  return user;
}

async function registerDoctor({ firstName, lastName, email, password, specialization }) {
  if (!firstName || !lastName || !email || !password) {
    const error = new Error("Please fill all required fields");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    specialization: specialization || "",
    role: "DOCTOR",
  });

  await doctor.save();

  return doctor;
}

async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error("Please provide email and password");
    error.status = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const payload = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );

  return { accessToken, user: payload };
}

module.exports = {
  registerUser,
  registerDoctor,
  loginUser,
};
