const express = require('express');
const {addClgday, getAllclgdays, getAllclaWorkingDays, getTodayWorkingDay} = require('../controllers/clgdaysController');

const router = express.Router();

router.post('/addday', addClgday);
router.get('/alldays', getAllclgdays);
router.get('/allworkingdays', getAllclaWorkingDays);
router.get('/todayworkingday', getTodayWorkingDay);

module.exports = router;