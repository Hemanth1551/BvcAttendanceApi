// const mongoose = require('mongoose');

// const HolidaySchema = new mongoose.Schema({
//     date: {
//         type: Date, // Use Date type instead of String for actual dates
//         required: true, // Correct spelling: 'required'
//     },
//     description: {
//         type: String,
//         required: true, // Correct spelling: 'required'
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('ClgHoliday', HolidaySchema);

const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  action: {
    type: String,
    enum: ['holiday', 'workingday'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('DaySchema', DaySchema);
