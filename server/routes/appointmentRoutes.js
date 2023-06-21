const express = require("express");
const { createAppointment } = require("../controllers/appointmentController");

const router = express.Router();

// POST request to add an appointment
router.post("/", createAppointment);
// router.delete("/", deleteAllAppointment)

module.exports = router;
