const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  dob: String,
  gender: String,
  selectedCourse: {type: [String], default: []},
  selectedStandard: {type: [String], default: []},
  photo: String, // store filename or S3 link
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports =  userSchema;
