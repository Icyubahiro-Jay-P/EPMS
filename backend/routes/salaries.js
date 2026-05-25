const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ month: -1, createdAt: -1 });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const salary = new Salary(req.body);
    salary.NetSalary = salary.GrossSalary - salary.TotalDeduction;
    const saved = await salary.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    data.NetSalary = data.GrossSalary - data.TotalDeduction;
    const salary = await Salary.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json(salary);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json({ message: 'Salary deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/report', async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const salaries = await Salary.find(filter).sort({ month: -1 });
    const empNos = [...new Set(salaries.map(s => s.Employee))];
    const employees = await Employee.find({ employeeNumber: { $in: empNos } });
    const empMap = {};
    employees.forEach(e => { empMap[e.employeeNumber] = e; });

    const report = salaries.map(s => ({
      _id: s._id,
      month: s.month,
      FirstName: empMap[s.Employee]?.FirstName || 'N/A',
      LastName: empMap[s.Employee]?.LastName || 'N/A',
      Position: empMap[s.Employee]?.Position || 'N/A',
      Department: empMap[s.Employee]?.Department || 'N/A',
      NetSalary: s.NetSalary
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
