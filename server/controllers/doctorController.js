// Populate dummy data for doctors
// controllers/doctorsController.js
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const moment = require('moment')

// Populate dummy data for doctors
const populateDummyDoctors = async (req, res) => {
  try {
    // const dummyDoctors = [
    //   {
    //     name: 'Javed Ansari',
    //     email: 'javedjonoansari1993@gmail.com',
    //     specialization: 'Pediatrics',
    //     expertIssues: ['Childhood vaccinations', 'Common cold'],
    //     availableSlots: generateTimeSlotsForMonth(),
    //   },
    //   {
    //     name: 'Jumma Ansari',
    //     email: 'jummaansari62@gmail.com',
    //     specialization: 'Cardiology',
    //     expertIssues: ['Heart disease', 'High blood pressure'],
    //     availableSlots: generateTimeSlotsForMonth(),
    //   },
    // ];

    // await Doctor.insertMany(dummyDoctors);


    const doctors = await Doctor.find({})
    const availability = []
    for (let j = 0; j < 7; j++) {
      availability.push({
        day: j,
        slots: [
          {slotText: '9:00 AM', slot: 9},
          {slotText: '10:00 AM', slot: 10},
          {slotText: '11:00 AM', slot: 11},
          {slotText: '12:00 AM', slot: 12},
          {slotText: '1:00 PM', slot: 13},
          {slotText: '2:00 PM', slot: 14},
          {slotText: '3:00 PM', slot: 15},
          {slotText: '4:00 PM', slot: 16}
        ]
      })
      
    }

    // for (let i = 0; i < doctors.length; i++) {
    //   const doctor = doctors[i];
    //   doctor.availability = availability
    //   await doctor.save()
    // }

    res.json({ message: 'Dummy doctors added successfully' , doctors });
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
    let doctors = await Doctor.find({}).populate(['appointments']);

    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      const newSlots = []
      for (let i = 0; i < 28; i++) {
        const mymoment = moment().add( i, "day")
        const day = mymoment.day()
        const dayTimeslot = doctor.availability.find(el => el.day == day)
        const appointments = doctor.appointments
        if (dayTimeslot) {
          newSlots.push({
            date: mymoment.format("ddd, MMM DD, YYYY"),
            timeSlots: dayTimeslot.slots.map(el => {
              return {
                slots: el.slotText,
                selected: appointments.find(el1 => el1.slot == el.slot && moment(el1.date).date() == mymoment.date() )  ? true : false,
                slot: el.slot,
                _id: el._id
              }
            })
          })
        }

        // console.log('m' , mymoment.format('ddd, MMM dd, YYYY') , day )
        
      }
      doctor.newSlots = newSlots
      
    }

    console.log('doctos', doctors)
    return res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message});
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
