const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  joiningDate: Date,
  password: String
}, { collection: 'EmployeeMaster' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
