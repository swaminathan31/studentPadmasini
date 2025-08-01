const express = require('express');
const multer = require('multer');
const userSchema = require('../models/User');
const router = express.Router();
const path = require('path');
const getConnection = require('../utils/dbConnection');
// multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });
//adding new user
router.post('/newUser', upload.single('photo'), async (req, res) => {
  console.log("inside register user")
  console.log("req.file:", req.file);
  try {
    const {
      firstname, lastname, email, password,
      mobile, dob, gender, selectedCourse, selectedStandard
    } = req.body;
 const dbName = "studentUsers" // 👈 e.g., jee, neet, etc.
    const connection = await getConnection(dbName);
    const User = connection.model('studentUserDetail', userSchema,'studentUserDetail'); 
      let photoUrl = null;
    const baseUrl = req.protocol + '://' + req.get('host');
photoUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      mobile,
      dob,
      gender,
      selectedCourse,
      selectedStandard,
      photo:photoUrl
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
