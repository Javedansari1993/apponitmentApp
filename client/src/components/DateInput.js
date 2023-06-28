import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CalenderClass from "./Calendar.module.css";
import Card from "./UI/Card";

const DateInput = ({ selectedDate, handleDateChange, isWeekend }) => {
  return (
    <Card>
      <div className="">
        <div className={CalenderClass.align}>
          <Calendar
            id="dateInput"
            className="border-0"
            value={selectedDate}
            onChange={handleDateChange}
            tileDisabled={({ date }) => isWeekend(date)}
          />
        </div>
      </div>
    </Card>
  );
};

export default DateInput;
