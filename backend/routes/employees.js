const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ employeeNumber: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const emp = new Employee(req.body);
    const saved = await emp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:empNo', async (req, res) => {
  try {
    const emp = await Employee.findOneAndUpdate(
      { employeeNumber: req.params.empNo },
      req.body,
      { new: true, runValidators: true }
    );
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:empNo', async (req, res) => {
  try {
    const emp = await Employee.findOneAndDelete({ employeeNumber: req.params.empNo });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
