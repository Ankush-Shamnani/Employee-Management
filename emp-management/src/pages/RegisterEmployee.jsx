import React, { useState, useEffect } from "react";
import { Link,useLocation  } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      navigate("/");
    }
  });

  const location = useLocation();

  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeJoiningDate, setNewEmployeeJoiningDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [submissionSuccess, setsubmissionSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const employeeEdit = location.state;
    if (employeeEdit) {
      setIsEditing(true);
      setEditingEmployeeId(employeeEdit._id);
      setNewEmployeeEmail(employeeEdit.email);
      setNewEmployeeFirstName(employeeEdit.firstName);
      setNewEmployeeLastName(employeeEdit.lastName);
      setNewEmployeeJoiningDate(employeeEdit.joiningDate.split("T")[0]);
    }
  }, [location.state]);

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      firstName: newEmployeeFirstName,
      lastName: newEmployeeLastName,
      email: newEmployeeEmail,
      joiningDate: newEmployeeJoiningDate,
    };

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/employees/${editingEmployeeId}`, employeeData );
        setMsg("Employee Updated Successfully")
          console.log(msg);
           setsubmissionSuccess(true);
      } else {
        await axios.post(`http://localhost:5000/employees`, employeeData);
         setMsg("Employee Successfully Registered")
         setsubmissionSuccess(true);
      }

      setNewEmployeeFirstName("");
      setNewEmployeeLastName("");
      setNewEmployeeEmail("");
      setNewEmployeeJoiningDate("");
      setIsEditing(false);
      setEditingEmployeeId(null);

      setTimeout(() => {
        navigate("/AllEmployees");
      }, 1300); // Redirect after 2 seconds

    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };


  

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const handleChangeFirstName = (e) => {
    setNewEmployeeFirstName(e.target.value);
  };

  const handleChangeLastName = (e) => {
    setNewEmployeeLastName(e.target.value);
  };

  const handleChangeEmail = (e) => {
    setNewEmployeeEmail(e.target.value);
  };

  const handleChangeJoiningDate = (e) => {
    setNewEmployeeJoiningDate(e.target.value);
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
      <div className="employee-registration-form">
          <h2>Employee Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={newEmployeeFirstName}
                onChange={handleChangeFirstName}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={newEmployeeLastName}
                onChange={handleChangeLastName}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="joiningDate">Joining Date:</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={newEmployeeJoiningDate}
                onChange={handleChangeJoiningDate}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newEmployeeEmail}
                onChange={handleChangeEmail}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
          {submissionSuccess && (
        <p style={{ color: "green" }}><center>{msg}</center></p>
      )}
        </div>
    </div>
  );
};
export default AdminPage;
