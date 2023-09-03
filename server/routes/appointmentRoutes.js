const express = require("express");
const {check} = require('express-validator')
const { createAppointment,cancelAppointment } = require("../controllers/appointmentController");

const router = express.Router();

// POST request to add an appointment
router.post("/", [
    check('patientName').exists().withMessage('patient name is required'),
    check('day').exists().withMessage('day is required'),
    check('slot').exists().withMessage('slot is required')
] , createAppointment);
// router.delete("/", deleteAllAppointment)
router.delete('/appointments/:id', cancelAppointment);

module.exports = router;
