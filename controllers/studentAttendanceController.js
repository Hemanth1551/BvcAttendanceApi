const studentAttendance = require('../models/StudentAttendance');

// add student attendence
exports.addStudentAttendance = async (req, res) => {
    const { studentId, date, presentedClasses, missingClasses, status, markedTime} = req.body;

    try{
        const existingAttendance = await studentAttendance.findOne({ studentId, date });
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already exists' });
        }

        const newStudentAttendance = await studentAttendance.create({
            studentId, date, presentedClasses, missingClasses, status, markedTime
        });
        res.status(200).json({message: 'Attendance added was successfully'});
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}


//get specific student attendance
exports.getAttendanceByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const attendanceRecords = await studentAttendance.find({ studentId });
    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance found for this student' });
    }

    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

