import React from "react";

const IssueSelect = ({
  selectedDoctor,
  selectedIssue,
  handleIssueChange,
  getDoctorById,
}) => {
  return (
    <div className="col-md-4 m-3 d-flex justify-content-center align-items-center">
      <label htmlFor="issueSelect" className="form-label fw-bold fs-5 mx-5">
        Issue:
      </label>
      <select
        id="issueSelect"
        className="form-select"
        value={selectedIssue}
        onChange={handleIssueChange}>
        <option value="">Select an issue</option>
        {getDoctorById(selectedDoctor)?.expertIssues.map((issue) => (
          <option key={issue} value={issue}>
            {issue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IssueSelect;
