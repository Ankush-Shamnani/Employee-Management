import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    if (!adminLoggedIn) {
      navigate("/");
    }
  });
  const navigate = useNavigate();
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const toggleLogoutMenu = () => {
    setShowLogoutMenu(!showLogoutMenu);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    navigate("/");
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
    </div>
  );
};
export default AdminPage;
