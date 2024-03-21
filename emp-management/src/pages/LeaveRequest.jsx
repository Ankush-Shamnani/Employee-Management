import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./Admin.css";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return format(date, "dd-MM-yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

const LeaveRequest = () => {
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      navigate("/");
    }
  });
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [processedRequests, setProcessedRequests] = useState([]);

  const toggleLogoutMenu = () => setShowLogoutMenu(!showLogoutMenu);

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/leaveRequests");
      setLeaveRequests(response.data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const pending = leaveRequests.filter(
      (request) => request.status.toLowerCase() === "pending approval"
    );
    const processed = leaveRequests.filter(
      (request) => request.status.toLowerCase() !== "pending approval"
    );
    setPendingRequests(pending);
    setProcessedRequests(processed);
  }, [leaveRequests]);

  const handleApprove = async (requestId) => {
    const isConfirmed = window.confirm(
      "Are you sure to approve leave request?"
    );
    if (isConfirmed) {
      try {
        const actionDate = new Date();
        const formattedActionDate = format(actionDate, "yyyy-MM-dd");

        await axios.put(
          `http://localhost:5000/leaveRequests/updateStatus/${requestId}`,
          {
            status: "Approved",
            actionDate: formattedActionDate,
          }
        );
        console.log(`Leave request with ID ${requestId} approved successfully`);
        fetchData();
      } catch (error) {
        console.error(
          `Error approving leave request with ID ${requestId}:`,
          error
        );
      }
    }
  };

  const handleReject = async (requestId) => {
    const isConfirmed = window.confirm(
      "Are you sure to reject the leave request?"
    );
    if (isConfirmed) {
      try {
        const actionDate = new Date();
        const formattedActionDate = format(actionDate, "yyyy-MM-dd");

        await axios.put(
          `http://localhost:5000/leaveRequests/updateStatus/${requestId}`,
          {
            status: "Rejected",
            actionDate: formattedActionDate,
          }
        );
        console.log(`Leave request with ID ${requestId} rejected successfully`);
        fetchData();
      } catch (error) {
        console.error(
          `Error rejecting leave request with ID ${requestId}:`,
          error
        );
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Welcome Admin</h1>

      <div className="navbar">
      <div className="nav-options">
          <Link to="/AllEmployees">Show All Employees</Link>
          <Link to="/LeaveRequest">Leave Requests</Link>
          <Link to="/RegisterEmployee">Register Employee</Link>
        </div>
        <div className="profile-menu">
          <div className="profile-photo" onClick={toggleLogoutMenu}>
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
          {showLogoutMenu && (
            <div className="logout-menu">
              <button onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="leave-request-table">
        <center>
          <div className="scrollable-table">
            <h2>Pending Requests</h2>
            <table>
              <thead className="freeze-table-header">
                <tr>
                  <th>Sr. No.</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Leave From</th>
                  <th>Leave Till</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length === 0 ? (
                  <center>
                    <h1>No Pending Requests</h1>
                  </center>
                ) : (
                  pendingRequests
                    .slice(0)
                    .reverse()
                    .map((request, index) => (
                      <tr key={request._id}>
                        <td>{index + 1}</td>
                        <td>{`${request.firstName} ${request.lastName}`}</td>
                        <td>{request.email}</td>
                        <td>{formatDate(request.leaveFrom)}</td>
                        <td>{formatDate(request.leaveTill)}</td>
                        <td>{request.reason}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="approve-button"
                              onClick={() => handleApprove(request._id)}
                            >
                              <FontAwesomeIcon icon={faCheck} /> Approve
                            </button>
                            <button
                              className="reject-button"
                              onClick={() => handleReject(request._id)}
                            >
                              <FontAwesomeIcon icon={faTimes} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </center>
      </div>

      <div className="leave-request-table">
        <center>
          <div className="scrollable-table">
            <h2>Processed Requests</h2>
            <table>
              <thead className="freeze-table-header">
                <tr>
                  <th>Sr. No.</th>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Leave From</th>
                  <th>Leave Till</th>
                  <th>Reason</th>
                  <th>Action Taken On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.length === 0 ? (
                  <center>
                    <h1>No Data Available</h1>
                  </center>
                ) : (
                  processedRequests
                    .slice(0)
                    .reverse()
                    .map((request, index) => (
                      <tr key={request._id}>
                        <td>{index + 1}</td>
                        <td>{`${request.firstName} ${request.lastName}`}</td>
                        <td>{request.email}</td>
                        <td>{formatDate(request.leaveFrom)}</td>
                        <td>{formatDate(request.leaveTill)}</td>
                        <td>{request.reason}</td>
                        <td>{formatDate(request.actionDate)}</td>
                        <td className={`status-${request.status}`}>
                          {request.status}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </center>
      </div>
    </div>
  );
};

export default LeaveRequest;
