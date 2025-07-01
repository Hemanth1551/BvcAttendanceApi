const express = require('express');
const { registerStudent, loginStudent, passwordChange, passwordChangeByEmail, studentVerification, passwordChangeByEmailConfig, getStudentsByBranch } = require('../controllers/studentController');

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.put('/passwordChange', passwordChange);
router.put('/passwordChangeByEmail', passwordChangeByEmail);
router.get('/verify', studentVerification);
router.put('/passwordChangeByEmailConfig', passwordChangeByEmailConfig);
router.post('/getStudentsByBranch', getStudentsByBranch);

module.exports = router;
