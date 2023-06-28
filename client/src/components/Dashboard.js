import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorSelect from "./DoctorSelect";
import IssueSelect from "./IssueSelect";
import DateInput from "./DateInput";
import TimeSlotList from "./TimeSlotList";
import Card from "./UI/Card";

const Dashboard = ({ user, setUser }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [activeSlot, setActiveSlot] = useState("");
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState("");
  // const [appointmentId, setAppointmentId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/doctors")
      .then((response) => {
        setDoctors(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedIssue("");
  };

  const handleIssueChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  const handleDateChange = (event) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (event < currentDate) {
      alert("Please select a date after the current date.");
      return;
    }

    if (!selectedDoctor) {
      alert("please select the doctor");
    } else if (!selectedIssue) {
      alert("please select the issues");
    }
    console.log(event);
    setSelectedDate(event);
    setSelectedTimeSlot("");
    setAppointment("");
    setError("");
    setActiveSlot("");
  };

  const handleTimeSlotSelection = (event, date) => {
    setSelectedTimeSlot(event);
    setActiveSlot(event);
    setSelectedDate(date);
  };

  const handleCancelAppointment = () => {
    const appointmentId = user.appointmentId;

    if (!appointmentId) {
      console.error("No appointmentId found");
      return;
    }

    axios
      .delete(`http://localhost:5000/appointments/${appointmentId}`)
      .then((response) => {
        console.log("Appointment canceled!");
        // Clear the selected appointment details in the component state
        setSelectedDoctor("");
        setSelectedIssue("");
        setSelectedDate("");
        setSelectedTimeSlot("");
        setActiveSlot("");
        setError("");
        // Update the user object to remove the appointmentId
        setUser((prevUser) => ({
          ...prevUser,
          appointmentId: undefined,
        }));
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data.error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:5000/appointments", {
        patientId: user._id,
        patientName: user.name,
        doctorId: selectedDoctor,
        issue: selectedIssue,
        dayName: selectedDate,
        time: selectedTimeSlot,
      })
      .then((response) => {
        const appointmentId = response.data.appointment._id;
        // Update the user object with the appointmentId
        setUser((prevUser) => ({
          ...prevUser,
          appointmentId: appointmentId,
        }));
        console.log("Appointment booked!", response.data);
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data.error);
      });
  };

  const getDoctorById = (doctorId) => {
    return doctors.find((doctor) => doctor._id === doctorId);
  };

  const getAvailableTimeSlots = () => {
    const doctor = getDoctorById(selectedDoctor);
    if (doctor && selectedIssue && selectedDate) {
      const selectDate = new Date(selectedDate);
      const dayName = selectDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      // console.log("dayName", dayName )
      const selectedIssueObj = doctor.availableSlots.find(
        (slot) => slot.date === dayName
      );
      // console.log(selectedIssueObj)
      if (selectedIssueObj) {
        return selectedIssueObj.timeSlots.map((timeSlot) => timeSlot);
      }
    }
    return [];
  };

  //   const doctorData = getDoctorById(selectedDoctor);
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 represents Sunday, 6 represents Saturday
  };
  // console.log("doctor", doctorData)
  //  console.log("date",selectedDate)

  return (
    <div className="container mt-5">
      <form className="mt-4" onSubmit={handleSubmit}>
        <Card>
          <div className="row justify-content-around">
            <DoctorSelect
              doctors={doctors}
              selectedDoctor={selectedDoctor}
              handleDoctorChange={handleDoctorChange}
            />
            <IssueSelect
              selectedDoctor={selectedDoctor}
              selectedIssue={selectedIssue}
              handleIssueChange={handleIssueChange}
              getDoctorById={getDoctorById}
            />
          </div>
        </Card>
        <div className="row mt-4">
          <div className="col-4 ">
            <DateInput
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              isWeekend={isWeekend}
            />
          </div>
          <div className="col-8 ">
            <TimeSlotList
              selectedDate={selectedDate}
              selectedDoctor={selectedDoctor}
              selectedIssue={selectedIssue}
              selectedTimeSlot={selectedTimeSlot}
              activeSlot={activeSlot}
              handleTimeSlotSelection={handleTimeSlotSelection}
              getDoctorById={getDoctorById}
              getAvailableTimeSlots={getAvailableTimeSlots}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-danger col-5"
            onClick={handleCancelAppointment}>
            Cancel Appointment
          </button>

          {error ? <h6>{error}</h6> : <h6>{appointment?.message}</h6>}
          <button
            type="submit"
            className="btn btn-success col-5"
            disabled={
              !selectedDoctor ||
              !selectedIssue ||
              !selectedDate ||
              !selectedTimeSlot
            }>
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
