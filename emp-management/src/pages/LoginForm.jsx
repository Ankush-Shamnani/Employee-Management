import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './LoginForm.css';

const LoginForm = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError('Please select a role');
      return;
    }
      if (role ==="employee"){
    try {
      const response = await axios.post('http://localhost:5000/employee/login', {
        username,
        password,
      });

      const { token } = response.data;
      const decodedToken = jwtDecode(token);

      if (decodedToken && decodedToken.role === 'employee') {
        localStorage.setItem('token', token);
        navigate(`/EmployeePage?id=${decodedToken.employeeId}`);
      } else {
        setError('Invalid role or credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login. Please try again later.');
    }

  }
  else if (role === "admin") {
    if (username === "Admin" && password === "Admin") {
      sessionStorage.setItem('adminLoggedIn', true);
      navigate("/AllEmployees");
    } else {
      setError('Invalid credentials for admin');
    }
  }
  };

  return (
    <div className='background'>
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="input-field">
            <label htmlFor="username">Username:</label>
            <input
              placeholder='Enter Username'
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password:</label>
            <input
              placeholder='Enter Password'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
