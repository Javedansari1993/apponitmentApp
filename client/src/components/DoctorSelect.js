import React from "react";

const DoctorSelect = ({ doctors, selectedDoctor, handleDoctorChange }) => {
  return (
    <div className="col-md-4  m-3 d-flex justify-content-center align-items-center">
      <label htmlFor="doctorSelect" className="form-label fw-bold fs-5 mx-5">
        Doctor:
      </label>
      <select
        id="doctorSelect"
        className="form-select"
        value={selectedDoctor}
        onChange={handleDoctorChange}>
        <option value="">Select a doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorSelect;
