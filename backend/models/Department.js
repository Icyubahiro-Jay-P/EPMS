const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  DepartementCode: { type: String, required: true, unique: true, uppercase: true },
  DepartementName: { type: String, required: true },
  GrossSalary: { type: Number, required: true },
  TotalDeduction: { type: Number, default: 0 }
});

module.exports = mongoose.model('Department', departmentSchema);
