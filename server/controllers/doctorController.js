// Populate dummy data for doctors
// controllers/doctorsController.js
const Doctor = require('../models/Doctor');

// Populate dummy data for doctors
const populateDummyDoctors = async (req, res) => {
  try {
    const dummyDoctors = [
      {
        name: 'Javed Ansari',
        email: 'javedjonoansari1993@gmail.com',
        specialization: 'Pediatrics',
        expertIssues: ['Childhood vaccinations', 'Common cold'],
        availableSlots: generateTimeSlotsForMonth(),
      },
      {
        name: 'Jumma Ansari',
        email: 'jummaansari62@gmail.com',
        specialization: 'Cardiology',
        expertIssues: ['Heart disease', 'High blood pressure'],
        availableSlots: generateTimeSlotsForMonth(),
      },
    ];

    await Doctor.insertMany(dummyDoctors);
    res.json({ message: 'Dummy doctors added successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate time slots for a month excluding Sundays and Saturdays
// Generate time slots for 30 days from the current date excluding Sundays and Saturdays
const generateTimeSlotsForMonth = () => {
  const availableSlots = [];
  const currentDate = new Date();
  const currentDatePointer = new Date(currentDate);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 29);
  
  while (currentDatePointer <= endDate) {
    const currentDay = currentDatePointer.getDay();
    if (currentDay !== 0 && currentDay !== 6) {
      const dayString = currentDatePointer.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const daySlots = [
        { selected: false, slots: '09:00 AM' },
        { selected: false, slots: '10:00 AM' },
        { selected: false, slots: '06:00 PM' },
      ];
      availableSlots.push({ date: dayString, timeSlots: daySlots });
    }
    currentDatePointer.setDate(currentDatePointer.getDate() + 1);
  }
  
  return availableSlots;
};


// ... rest of the code ...


// Get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
// Get doctor
// GET /doctors/:id
const getDoctorById =  async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Select a time slot for a doctor
const selectTimeSlot = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const timeSlotId = req.params.timeSlotId;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const timeSlot = doctor.availableSlots.reduce((foundSlot, day) => {
      const slot = day.timeSlots.find((slot) => slot._id.toString() === timeSlotId);
      return foundSlot || slot;
    }, null);

    if (!timeSlot) {
      return res.status(404).json({ error: 'Time slot not found' });
    }

    timeSlot.selected = true;

    await doctor.save();

    res.json({ message: 'Time slot selected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get doctors with selected time slots
const getDoctorsWithSelectedSlots = async (req, res) => {
  try {
    const doctors = await Doctor.find({ 'availableSlots.timeSlots.selected': true });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAllDoctors = async (req, res) => {
  try {
    await Doctor.deleteMany({});
    res.json({ message: 'All doctors deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  populateDummyDoctors,
  getAllDoctors,
  selectTimeSlot,
  getDoctorsWithSelectedSlots,
  getDoctorById,
  deleteAllDoctors
};