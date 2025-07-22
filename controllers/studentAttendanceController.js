const studentAttendance = require('../models/StudentAttendance');
const clgdays = require('../models/ClgDays');
const student = require('../models/Student');


// add student attendence
// exports.addStudentAttendance = async (req, res) => {
//     const { studentId, date, presentedClasses, missingClasses, status, markedTime} = req.body;

//     try{
//         const existingAttendance = await studentAttendance.findOne({ studentId, date });
//         if (existingAttendance) {
//             return res.status(400).json({ message: 'Attendance already exists' });
//         }

//         const newStudentAttendance = await studentAttendance.create({
//             studentId, date, presentedClasses, missingClasses, status, markedTime
//         });
//         res.status(200).json({message: 'Attendance added was successfully'});
//     }catch(err){
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// }


exports.addStudentAttendance = async (req, res) => {
    const { studentId, date, presentedClasses, missingClasses, status, markedTime, inCollege, deviceId} = req.body;

    try{
        const stu = await student.findOne({_id:studentId});
        if(stu.deviceId === deviceId){
          const existingAttendancewithip = await studentAttendance.find({ date, deviceId });
            if (existingAttendancewithip.length > 0) {
                return res.status(400).json({ message: 'Attendance for this date has already been submitted from your device.' });
            } 
            if(status === "present"){
              if(inCollege === true){
                const location = "AtCollage";
                const newStudentAttendance = await studentAttendance.create({
                  studentId, date, presentedClasses, missingClasses, status, markedTime, location, deviceId
                });
                res.status(200).json({message: 'Attendance added was successfully'});
              }else{
                return res.status(400).json({ message: 'Your not in collage area.' });
              }
            }else if(status === "absent"){
              const location = "AtOutofCollage";
              const newStudentAttendance = await studentAttendance.create({
                  studentId, date, presentedClasses, missingClasses, status, markedTime, location, deviceId
                });
                res.status(200).json({message: 'Attendance added was successfully'});
            }
        }
        else{
          return res.status(400).json({ message: 'Dont post others attedance' });
        }
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

    const markedDates = new Set(
      attendanceRecords.map((rec) => rec.date.toISOString().split('T')[0])
    );

    const merged = workingDays
      .filter((day) => !markedDates.has(day.date.toISOString().split('T')[0]))
      .map((day) => ({
        date: day.date.toISOString().split('T')[0],
        status: 'absent',
      }));

    res.status(200).json(merged);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getAllstudentattedancestoid = async (req, res) => {
  try {
    const allStudentAttendance = await studentAttendance.find();
    const allStudents = await student.find();

    // Create a Map of studentId to student object for fast lookup
    const studentMap = new Map();
    allStudents.forEach(stu => {
      if (stu && stu._id) {
        studentMap.set(String(stu._id), stu);
      }
    });

    const combinedData = allStudentAttendance.map(att => {
      const studentId = att?.studentId?.toString?.(); // ensure string format
      const studentData = studentMap.get(studentId) || {};

      return {
        studentId: studentId || null,
        email: studentData.email || null,
        rollNumber: studentData.rollNumber || null,
        name: studentData.name || null,
        date: att.date || null,
        branch: studentData.branch || null,
        presentedClasses: att.presentedClasses || 0,
        missingClasses: att.missingClasses || 0,
        status: att.status || null,
        markedTime: att.markedTime || null
      };
    });

    res.status(200).json(combinedData);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteattendance = async (req, res) => {
  try {
    const { stuId, date } = req.params;
    const result = await studentAttendance.deleteOne({ studentId: stuId, date: date });

    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Attendance was deleted.' });
    } else {
      res.status(404).json({ message: 'Attendance not found. Nothing was deleted.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



