const express = require('express');
const { addStudentAttendance, getAttendanceByStudentId, getStudentAttendanceMerged, getAllstudentattedancestoid, deleteattendance, getAllstudenttodayattedances } = require('../controllers/studentAttendanceController');
const router = express.Router();

router.post('/addStudentattendance', addStudentAttendance);
router.get('/student/:studentId', getAttendanceByStudentId); // ← NEW GET route
router.get('/student/merged/:studentId', getStudentAttendanceMerged);
router.get('/getAllstudentattedancestoid', getAllstudentattedancestoid); // ← NEW GET route
router.get('/getAllstudenttodayattedances', getAllstudenttodayattedances);
router.delete('/student/deleteatt/:stuId/:date', deleteattendance);


module.exports = router;
