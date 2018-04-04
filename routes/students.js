const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Student = require('../models/Student');

// Register
router.post('/register', (req, res, next) => {
  let newStudent = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    studentId: req.body.studentId,
    password: req.body.password,
    program: req.body.program
  });

  Student.addStudent(newStudent, (err, student) => {
    if (err) {
      res.json({
        success: false,
        msg: 'Failed to register new student'
      });
    } else {
      res.json({
        success: true,
        msg: 'New Student registered'
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const studentId = req.body.studentId;
  const password = req.body.password;

  Student.getStudentByStudentId(studentId, (err, student) => {
    if (err) {
      throw err;
    }
    if (!student) {
      return res.json({
        success: false,
        msg: 'Student not found'
      });
    }
    Student.comparePassword(password, student.password, (err, isMatch) => {
      if (err) {
        throw err;
      }
      if (isMatch) {
        const token = jwt.sign(student.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          student: {
            id: student._id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            program: student.program,
            email: student.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  res.json({
    student: req.user
  });
});
module.exports = router;