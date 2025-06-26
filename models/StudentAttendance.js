const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    date: {
        type: Date, // Use Date type instead of String for actual dates
        required: true, // Correct spelling: 'required'
    },
    presentedClasses: {
        type: Number,
        required: true,
    },
    missingClasses: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: true,
    },
    markedTime: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("StudentAttendance", AttendanceSchema);
