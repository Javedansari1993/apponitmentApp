import React from "react";
import { Link } from "react-router-dom";

const Header = ({ user, handleLogout }) => {
  console.log(user);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow py-4">
      <div className="container">
        <img  alt="hedr" src="data:image/png;base64,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"/>
        {/* <Link className="navbar-brand" to="/">
                    Search appointment
                </Link> */}
        <h1 className="">Appointment Booking App</h1>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <li>
                <Link
                  className="nav-link text-gray fw-bold fs-4 "
                  onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item ">
                  <Link
                    className="nav-link text-primary fw-bold fs-4"
                    to="/signup">
                    Signup
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-primary fw-bold fs-4" to="/">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
          <button type="button" class="btn btn-primary position-relative mx-4">
            {user && user.name}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              99+
              <span class="visually-hidden">unread messages</span>
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
