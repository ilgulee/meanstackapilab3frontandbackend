const express = require('express');
const router = express.Router();
const passport = require('passport');
const config = require('../config/database');
const Course = require('../models/Course');

router.delete('/api/courses/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let courseId = req.params.id;
    Course.dropCourse(courseId, (err, course) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to drop course'
            });
        } else {
            res.json({
                success:true,
                msg:'dropped'
            });
        }

    });
});

router.put('/api/courses/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let courseId = req.params.id;
    let updated = {};
    updated = req.body;
    updated.studentRef = req.user._id;
    
    Course.updateCourse(courseId, updated, {
        new: true
    }, (err, course) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to update course'
            });
        } else {
            res.json({
                success:true,
                msg:'successfully updated'
            });
        }
    });
});

router.get('/api/courses/:id', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let studentRef = req.user._id;
    let courseId = req.params.id;
    Course.getCourseById(courseId, (err, course) => {
        if (studentRef != course.studentRef) {
            res.json({
                success: false,
                msg: 'Failed to retrive courses'
            });
        }
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to retrive courses'
            });
        } else {
            res.json(course);
        }
    });
});

router.get('/api/courses', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let studentRef = req.user._id;
    Course.getCoursesByStudentRef(studentRef, (err, courses) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to retrive courses'
            });
        } else {
            res.json(courses);
        }
    });
});

router.post('/api/courses', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    let newCourse = new Course({
        studentRef: req.user._id,
        courseCode: req.body.courseCode,
        courseName: req.body.courseName,
        section: req.body.section,
        semester: req.body.semester
    });
    Course.addCourse(newCourse, (err, course) => {
        if (err) {
            res.json({
                success: false,
                msg: 'Failed to register new course'
            });
        } else {
            res.json({
                course:course,
                success: true,
                msg: 'New course registered'
            });
        }
    });
});

module.exports = router;