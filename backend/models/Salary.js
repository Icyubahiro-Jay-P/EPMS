const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  Employee: { type: String, required: true },
  GrossSalary: { type: Number, required: true },
  TotalDeduction: { type: Number, default: 0 },
  NetSalary: { type: Number, required: true },
  month: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);
