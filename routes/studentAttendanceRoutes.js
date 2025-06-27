const express = require('express');
const { addStudentAttendance, getAttendanceByStudentId, getStudentAttendanceMerged } = require('../controllers/studentAttendanceController');
const router = express.Router();

router.post('/addStudentattendance', addStudentAttendance);
router.get('/student/:studentId', getAttendanceByStudentId); // ← NEW GET route
router.get('/student/merged/:studentId', getStudentAttendanceMerged);

module.exports = router;
