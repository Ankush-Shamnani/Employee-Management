/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./Employee.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const RequestLeave = () => {
  const [leaveFrom, setleaveFrom] = useState("");
  const [leaveTill, setleaveTill] = useState("");
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [CurrentEmpData, setCurrentEmpData] = useState({});
  const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.employeeId) {
        setEmployeeId(decodedToken.employeeId);
      } else {
        console.error("Employee id not found in token");
      }
    } else {
      console.error("Token not found");
    }
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (employeeId) {
          const response = await axios.get(
            `http://localhost:5000/CurrentEmpData/${employeeId}`
          );
          setCurrentEmpData(response.data);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  console.log(CurrentEmpData);

  const handleleaveFromChange = (e) => {
    setleaveFrom(e.target.value);
    setErrorMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/");
  };

  const handleleaveTillChange = (e) => {
    setleaveTill(e.target.value);
    setErrorMessage("");
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().slice(0, 10);

    if (leaveFrom < today || leaveTill < today) {
      setErrorMessage("Start date or end date cannot be in the past.");
      return;
    }

    if (leaveFrom > leaveTill) {
      setErrorMessage("Start date cannot be after end date.");
      return;
    }

    if (
      leaveFrom < CurrentEmpData.joiningDate ||
      leaveTill < CurrentEmpData.joiningDate
    ) {
      setErrorMessage(
        `Leave dates cannot be before joining date\nyour joining date is ${CurrentEmpData.joiningDate}`
      );
    }
    try {
      const firstName = CurrentEmpData.firstName;
      const lastName = CurrentEmpData.lastName;
      const email = CurrentEmpData.email;
      await axios.post("http://localhost:5000/RequestLeave", {
        leaveFrom,
        leaveTill,
        reason,
        employeeId,
        firstName,
        lastName,
        email,
      });

      console.log("Leave request submitted:");
      Navigate(`/EmployeePage?id=${employeeId}`);
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  const toggleLogoutMenu = () => {
    setIsLogoutMenuOpen(!isLogoutMenuOpen);
  };

  console.log(employeeId);
  return (
    <div className="employee-dashboard-container">
      <h1>
        Welcome, {CurrentEmpData.firstName}     {CurrentEmpData.lastName}
      </h1>
      <div className="navbar">
        <div className="nav-options">
          <Link to={`/EmployeePage?id=${employeeId}`}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
          <Link to={`/RequestLeave?id=${employeeId}`}>Request Leave</Link>
        </div>
        <div className="profile-menu">
          <div className="profile-photo" onClick={toggleLogoutMenu}>
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
          {isLogoutMenuOpen && ( // Render logout menu only if isLogoutMenuOpen is true
            <div className="logout-menu">
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="leave-request-form">
        <h2>Request Leave</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="leaveFrom">Start Date:</label>
            <input
              type="date"
              id="leaveFrom"
              value={leaveFrom}
              onChange={handleleaveFromChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="leaveTill">End Date:</label>
            <input
              type="date"
              id="leaveTill"
              value={leaveTill}
              onChange={handleleaveTillChange}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="reason">Reason:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={handleReasonChange}
              required
            ></textarea>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RequestLeave;
