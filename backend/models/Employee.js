const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeNumber: { type: String, required: true, unique: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Position: { type: String, required: true },
  Address: { type: String, default: '' },
  Telephone: { type: String, default: '' },
  Gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  hiredDate: { type: Date, required: true },
  Department: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
