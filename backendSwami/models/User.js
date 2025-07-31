const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  dob: String,
  gender: String,
  selectedCourse: String,
  selectedStandard: String,
  photo: String, // store filename or S3 link
}, { timestamps: true });

module.exports =  userSchema;
