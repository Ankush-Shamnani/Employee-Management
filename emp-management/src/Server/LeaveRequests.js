const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  leaveFrom: { type: Date, required: true },
  leaveTill: { type: Date, required: true },
  reason: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending Approval' },
  actionDate: { type: Date }
}, { collection: 'LeaveRequestMaster' });

const Requests = mongoose.model('Requests', RequestSchema);

module.exports = Requests;
