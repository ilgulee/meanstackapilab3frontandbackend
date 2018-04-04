const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

// Student Schema
const StudentSchema = mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: 'First name is required'
    },
    lastName: {
        type: String,
        trim: true,
        required: 'Last name is required'
    },
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    studentId: {
        type: String,
        required: 'StudentID is required',
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    program: {
        type: String,
        trim: true,
        required: 'Program is required'
    }
});

const Student=module.exports = mongoose.model('student', StudentSchema);

module.exports.getStudentById = function (id, callback) {
    Student.findById(id, callback);
}

module.exports.getStudentByStudentId = function (studentId, callback) {
    const query = {
        studentId: studentId
    }
    Student.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err){
        throw err;
      }
      callback(null, isMatch);
    });
  }

module.exports.addStudent = function (newStudent, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if (err) {
                throw err;
            }
            newStudent.password = hash;
            newStudent.save(callback);
        });
    });
}