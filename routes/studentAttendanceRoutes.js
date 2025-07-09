const express = require('express');
const { addStudentAttendance, getAttendanceByStudentId, getStudentAttendanceMerged, getAllstudentattedancestoid } = require('../controllers/studentAttendanceController');
const router = express.Router();

router.post('/addStudentattendance', addStudentAttendance);
router.get('/student/:studentId', getAttendanceByStudentId); // ← NEW GET route
router.get('/student/merged/:studentId', getStudentAttendanceMerged);
router.get('/getAllstudentattedancestoid', getAllstudentattedancestoid); // ← NEW GET route

module.exports = router;
