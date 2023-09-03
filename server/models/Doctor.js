// models/Doctor.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  expertIssues: {
    type: [String],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  availableSlots: {
    type: [{
      date: {
        type: String, // Change the type to Date
        required: true
      },
      timeSlots: {
        type: [{
          selected: {
            type: Boolean,
            default: false
          },
          slots: {
            type: String,
            required: true
          }
        }],
        required: true
      }
    }],
    required: true
  },
  availability: [
    {
      day: {type: Number, required: true},
      slots: [
        {
          slotText: {type: String, required: true},
          slot: {type: Number, required: true}
        }
      ]
    }
  ],
  newSlots: {type: Array, default: []}
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctorId'
});
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
