const express = require('express');
const { addStudentAttendance, getAttendanceByStudentId } = require('../controllers/studentAttendanceController');
const router = express.Router();

router.post('/addStudentattendance', addStudentAttendance);
router.get('/student/:studentId', getAttendanceByStudentId); // ← NEW GET route


module.exports = router;