import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
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
  const [employees, setEmployees] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
 

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
    navigate("/RegisterEmployee");
  };


  const handleUpdate = (employeeId) => {
    const employee = employees.find((e) => e._id === employeeId);
    if (employee) {
      navigate("/RegisterEmployee", {state: employee})
    }
  };

  const handleDelete = async (employeeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/employees/${employeeId}`);
        setShowDeletePopup(true);
        setTimeout(() => {
          setShowDeletePopup(false)
        }, 1800);
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
        {showDeletePopup && (
        <div className="delete-success-popup">
          Employee successfully deleted!
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
