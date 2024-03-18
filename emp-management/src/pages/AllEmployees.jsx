import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faHome,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Admin.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
  return format(new Date(dateString), "dd-MM-yyyy");
}

const AllEmployees = () => {
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      navigate("/");
    }
  });

  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeJoiningDate, setNewEmployeeJoiningDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
  };

  const handleAddEmployee = () => {
    setShowEmployeeForm(true);
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
          `http://localhost:5000/employees/${editingEmployeeId}`,
          employeeData
        );
      } else {
        await axios.post(`http://localhost:5000/employees`, employeeData);
      }

      setNewEmployeeFirstName("");
      setNewEmployeeLastName("");
      setNewEmployeeEmail("");
      setNewEmployeeJoiningDate("");
      setShowEmployeeForm(false);
      setIsEditing(false);
      setEditingEmployeeId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleUpdate = (employeeId) => {
    const employee = employees.find((e) => e._id === employeeId);
    if (employee) {
      setNewEmployeeFirstName(employee.firstName);
      setNewEmployeeLastName(employee.lastName);
      setNewEmployeeEmail(employee.email);
      setNewEmployeeJoiningDate(employee.joiningDate.split("T")[0]);
      setEditingEmployeeId(employeeId);
      setIsEditing(true);
      setShowEmployeeForm(true);
    }
  };

  const handleDelete = async (employeeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/employees/${employeeId}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    } else {
      console.log("Employee deletion cancelled.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Welcome Admin</h1>

      <div className="navbar">
        <div className="nav-options">
          <Link to="/AdminPage">
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
          <Link to="/AllEmployees">Show All Employees</Link>
          <Link to="/LeaveRequest">Leave Requests</Link>
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

      {showEmployeeForm ? (
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
        </div>
      ) : (
        <div className="employee-table">
          <button className="add-employee-button" onClick={handleAddEmployee}>
            Add Employee <FontAwesomeIcon icon={faPlus} />
          </button>
          <center>
            <div className="table-container">
              <table>
                <thead className="freeze-table-header">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joining Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => {
                    return (
                      <tr key={employee._id}>
                        <td>{index + 1}</td>
                        <td>{`${employee.firstName} ${employee.lastName}`}</td>
                        <td>{employee.email}</td>
                        <td>{formatDate(employee.joiningDate)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="update-button"
                              onClick={() => handleUpdate(employee._id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(employee._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </center>
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
