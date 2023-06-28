// routes/appointments.js
const express = require("express");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor")
const User = require("../models/User")
const nodemailer = require("nodemailer");

// POST /appointments
const createAppointment = async (req, res) => {
  try {
    // Extract appointment data from request body
    const { patientName, patientId, doctorId, issue, dayName, time } = req.body;
    const selectDate = new Date(dayName);
    const date = selectDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

    // Fetch the doctor's name and email
    const doctorData = await Doctor.findById(doctorId);
    const doctorName = doctorData.name;
    const doctorEmail = doctorData.email;
    const userData = await User.findById(patientId)
    const userEmail = userData.email

    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ error: "Appointment already booked for the specified date and time" });
    }

    // Create a new appointment object with the doctor's name
    const appointment = new Appointment({
      patientName,
      patientId,
      doctorId,
      doctorName, // Save the doctor's name
      issue,
      date,
      time,
    });

    // Save the appointment to the database
    const savedAppointment = await appointment.save();

    // Update the doctor's availableSlots to mark the selected time slot as booked (selected: true)
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: doctorId, "availableSlots.date": date },
      { $set: { "availableSlots.$.timeSlots.$[elem].selected": true } },
      { arrayFilters: [{ "elem.slots": time }], new: true }
    );

    // Send confirmation emails to the doctor and user
    const transporter = nodemailer.createTransport({
      // Configure your email provider settings here
      // Example using Gmail SMTP:
      service: 'gmail',
      auth: {
        user: 'merndeveloper07@gmail.com',
        pass: 'qsdpiozelrwffizr'
      }
    });

    const userMailOptions = {
      from: 'merndeveloper07@gmail.com',
      to: userEmail,
      subject: 'Appointment Confirmation',
      text: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} at ${time} has been successfully booked.`
    };

    const doctorMailOptions = {
      from: 'merndeveloper07@gmail.com',
      to: doctorEmail,
      subject: 'Appointment Confirmation',
      text: `Dear Dr. ${doctorName}, you have a new appointment booked by ${patientName} on ${date} at ${time}.`
    };

    // Send emails
    transporter.sendMail(userMailOptions);
    transporter.sendMail(doctorMailOptions);

    res.json({ message: "Appointment booked successfully", appointment: savedAppointment });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /appointments/:id
const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Delete the appointment from the database
    await appointment.remove();

    // Update the doctor's availableSlots to mark the selected time slot as available again (selected: false)
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { _id: appointment.doctorId, "availableSlots.date": appointment.date },
      { $set: { "availableSlots.$.timeSlots.$[elem].selected": false } },
      { arrayFilters: [{ "elem.slots": appointment.time }], new: true }
    );

    // Send cancellation email to the user
    const transporter = nodemailer.createTransport({
      // Configure your email provider settings here
      // Example using Gmail SMTP:
      service: 'gmail',
      auth: {
        user: 'merndeveloper07@gmail.com',
        pass: 'qsdpiozelrwffizr'
      }
    });

    const userMailOptions = {
      from: 'merndeveloper07@gmail.com',
      to: appointment.patientEmail,
      subject: 'Appointment Cancellation',
      text: `Dear ${appointment.patientName}, your appointment with Dr. ${appointment.doctorName} on ${appointment.date} at ${appointment.time} has been cancelled.`
    };

    // Send cancellation email
    transporter.sendMail(userMailOptions);

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createAppointment,
  cancelAppointment,
};

