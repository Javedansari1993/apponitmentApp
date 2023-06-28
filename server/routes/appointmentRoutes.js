const express = require("express");
const { createAppointment,cancelAppointment } = require("../controllers/appointmentController");

const router = express.Router();

// POST request to add an appointment
router.post("/", createAppointment);
// router.delete("/", deleteAllAppointment)
router.delete('/appointments/:id', cancelAppointment);

module.exports = router;
