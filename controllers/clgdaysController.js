const clgdays = require('../models/ClgDays');

//holidays adding
exports.addClgday = async (req, res) => {
    const { date, action, description} = req.body;

    try{
        const existingHoliday = await clgdays.findOne({ date });
        if (existingHoliday) {
            return res.status(400).json({ message: 'Collage day already exists' });
        }

        const newHoliday = await clgdays.create({
            date, action, description
        });

        res.status(200).json({message: 'Collage day was added successfully'});
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

//get all holidays
exports.getAllclgdays = async (req, res) => {
    try{
        const days = await clgdays.find().sort({ date : 1 });
        const formatteddays = days.map(day => ({
            _id: day._id,
            date: day.date.toISOString().split('T')[0], // Format: "YYYY-MM-DD"
            action: day.action,
            description: day.description,
            createdAt: day.createdAt,
            updatedAt: day.updatedAt
        }));
        res.status(200).json(formatteddays);
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.getAllclaWorkingDays = async (req, res) => {
    try{
        const days = await clgdays.find({ action: "workingday" }).sort({ date : 1 });
        res.status(200).json(days);
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });

    }
}

exports.getTodayWorkingDay = async (req, res) => {
    try{
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const days = await clgdays.find({ action: "workingday", date: formattedDate }).sort({ date : 1 });
        res.status(200).json(days);
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });

    }
}