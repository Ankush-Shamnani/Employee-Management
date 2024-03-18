require("dotenv").config;
const express = require("express");
const mongoose = require("mongoose");
const Employee = require("./EmployeeModel");
const cors = require("cors");
const Requests = require("./LeaveRequests");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateRandomPassword = require("./passwordGenerator");
const { sendCredentials, sendStatus } = require("./MailSender");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/EmployeeManagement", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to Database Successfully");
});

// fetch all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// fetch all Leave Requests from LeaveRequestMaster
app.get("/LeaveRequests", async (req, res) => {
  try {
    const requests = await Requests.find();
    res.json(requests);
  } catch (error) {
    console.error("Error fetching Leave Requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//fetch all requests of particlular employee by passing EmployeeID
app.get("/leaveRequestsOfEmployee", async (req, res) => {
  try {
    const { id } = req.query;
    const requests = await Requests.find({ employeeId: id });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching Leave Requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Add new employee in database and sending credentials through email
app.post("/employees", async (req, res) => {
  try {
    const { firstName, lastName, email, joiningDate } = req.body;
    const Password = await generateRandomPassword();
    const password = await bcrypt.hash(Password, 10);

    if (!firstName || !lastName || !email || !joiningDate) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      joiningDate,
      password,
    });
    await newEmployee.save();
    sendCredentials(newEmployee, Password);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update leave request status in databas by admin and send email
app.put("/leaveRequests/updateStatus/:id", async (req, res) => {
  const { status, actionDate } = req.body;
  const { id } = req.params;

  try {
    const leaveRequest = await Requests.findByIdAndUpdate(
      id,
      { status, actionDate },
      { new: true }
    );
    sendStatus(leaveRequest);

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found" });
    }

    return res
      .status(200)
      .json({ message: "Leave request status updated successfully" });
  } catch (error) {
    console.error("Error updating leave request status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//update the employee details by EmployeeID
app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, joiningDate } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        joiningDate,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Send back the updated employee data
    res.json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Delete the employee from Database
app.delete("/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//handle employee login
app.post("/employee/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //  username is the email of employee
    const email = username.trim();
    const employee = await Employee.findOne({ email });
    if (!employee) {
      console.log("Username Not Exists");
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      console.log("Password not correct");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        username: employee.username,
        role: "employee",
        employeeId: employee._id,
      },
      "ce2cd56c43ca3ec68df77fa9c7d2548919fba8b7eeaa693c84ca45a36f11d013",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//fecth data of currently loged in employee by EmployeeId
app.get("/CurrentEmpData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Error fetching employee data" });
  }
});

//Save leave request of employee requested by employee
app.post("/RequestLeave", async (req, res) => {
  try {
    const {
      leaveFrom,
      leaveTill,
      reason,
      employeeId,
      firstName,
      lastName,
      email,
    } = req.body;

    const leaveRequest = new Requests({
      leaveFrom,
      leaveTill,
      reason,
      employeeId,
      firstName,
      lastName,
      email,
    });
    await leaveRequest.save();

    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error("Error saving leave request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});