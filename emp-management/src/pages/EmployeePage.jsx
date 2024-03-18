/* eslint-disable no-restricted-globals */
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./Employee.css";
import axios from "axios";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";

function formatDate(dateString) {
  return format(new Date(dateString), "dd-MM-yyyy");
}

const EmployeePage = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [CurrentEmpData, setCurrentEmpData] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleLogoutMenu = () => {
    setLogoutMenuOpen(!logoutMenuOpen);
  };

  const fetchRequest = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/leaveRequestsOfEmployee?id=${employeeId}`
      );
      setLeaveRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("error fetching request", error);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return (
    <div className="employee-dashboard-container">
      <h1>
        Welcome, {CurrentEmpData.firstName}      {CurrentEmpData.lastName}
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
          {logoutMenuOpen && (
            <div className="logout-menu">
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="leave-requests-table">
        <h2>Applied Leave Requests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead className="freeze-table-header">
              <tr>
                <th>Sr. No.</th>
                <th>Leave From</th>
                <th>Leave Till</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <h1>Not Applied For Any Leave</h1>
              ) : (
                leaveRequests
                  .slice(0)
                  .reverse()
                  .map((request, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(request.leaveFrom)}</td>
                      <td>{formatDate(request.leaveTill)}</td>
                      <td>{request.reason}</td>
                      <td className={`status-${request.status}`}>
                        {request.status}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
