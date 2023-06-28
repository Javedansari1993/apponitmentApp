import React from "react";
import Card from "./UI/Card";

const TimeSlotList = ({
  selectedDate,
  selectedDoctor,
  selectedIssue,
  selectedTimeSlot,
  activeSlot,
  handleTimeSlotSelection,
  getDoctorById,
  getAvailableTimeSlots,
}) => {
  const doctorData = getDoctorById(selectedDoctor);

  return (
    <Card>
      <div style={{ height: 360, overflowX: "hidden", overflowY: "auto" }}>
        <label className="form-label"></label>
        <h6>
          {selectedDate.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h6>
        <ul className="list-group">
          <div className="row">
            {getAvailableTimeSlots().map((timeSlot) => (
              <div className="col-4 d-flex justify-content-center">
                <li
                  className={`list-group-item rounded fw-bold text-white ${
                    timeSlot.selected || timeSlot.slots === activeSlot
                      ? "d-none"
                      : ""
                  } ${
                    timeSlot.slots.includes("AM")
                      ? "time-slot-am"
                      : "time-slot-pm"
                  }`}
                  onClick={() => handleTimeSlotSelection(timeSlot.slots)}
                  key={timeSlot._id}>
                  {timeSlot.slots}
                </li>
              </div>
            ))}
          </div>
          {doctorData && !selectedDate && (
            <>
              <h2 className="align-self-center">Available Time Slots</h2>
              {doctorData.availableSlots.map((slot) => (
                <div key={slot.date}>
                  <h5 className="mx-5 my-4">{slot.date}</h5>
                  <div className="row">
                    {slot.timeSlots.map((timeSlot, index) => (
                      <div
                        className={`col-4 d-flex justify-content-center ${
                          timeSlot.selected ? "d-none" : ""
                        }`}
                        key={timeSlot.slots}>
                        <li
                          className={`list-group-item rounded fw-bold text-white`}
                          onClick={() =>
                            alert("please select date")
                          }>
                          {timeSlot.slots}
                        </li>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default TimeSlotList;
