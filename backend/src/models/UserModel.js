const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  specialization: {
    type: String,
    trim: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    enum: ["PATIENT", "DOCTOR", "ADMIN"],
    default: "PATIENT"
  },

  refreshToken: {
  type: String
}
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
