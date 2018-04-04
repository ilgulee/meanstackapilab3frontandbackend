const mongoose = require('mongoose');
const config = require('../config/database');

const CourseSchema = mongoose.Schema({
    studentRef: {
        type: String,
        trim: true,
    },
    courseCode: {
        type: String,
        trim: true,
        required: 'Course Code is required'
    },
    courseName: {
        type: String,
        trim: true,
        required: 'Course Name is required'
    },
    section: {
        type: String,
        trim: true,
        required: 'Course Section is required'
    },
    semester: {
        type: String,
        trim: true,
        required: 'Semester is required'
    }
});

const Course = module.exports = mongoose.model('course', CourseSchema);

module.exports.addCourse = function (newCourse, callback) {
    newCourse.save(callback);
}

module.exports.getCoursesByStudentRef = function (studentRef, callback) {
    Course.find({
        studentRef: studentRef
    }, callback);
}

module.exports.getCourseById = function (id, callback) {
    Course.findById(id, callback);
}

module.exports.updateCourse = (id, course, options, callback) => {
    let query = {
        _id: id
    };
    Course.findOneAndUpdate(query, course, options, callback);
}

module.exports.dropCourse = (id, callback) => {
	let query = {_id: id};
	Course.remove(query, callback);
}