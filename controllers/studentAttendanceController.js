const studentAttendance = require('../models/StudentAttendance');
const clgdays = require('../models/ClgDays');


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
    // if (!attendanceRecords.length) {
    //   return res.status(404).json({ message: 'No attendance found for this student' });
    // }

    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStudentAttendanceMerged = async (req, res) => {
  const { studentId } = req.params;

  try {
    const workingDays = await clgdays.find({ action: "workingday" }).sort({ date: 1 });
    const attendanceRecords = await studentAttendance.find({ studentId });

    const attendanceMap = {};
    attendanceRecords.forEach((rec) => {
      const date = rec.date.toISOString().split('T')[0];
      attendanceMap[date] = rec.status || 'present'; // default to present
    });

    const merged = workingDays.map((day) => {
      const date = day.date.toISOString().split('T')[0];
      return {
        date: date,
        status: attendanceMap[date] || 'absent', // absent if not found
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


