const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ DepartementCode: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const dept = new Department(req.body);
    const saved = await dept.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:code', async (req, res) => {
  try {
    const dept = await Department.findOneAndUpdate(
      { DepartementCode: req.params.code },
      req.body,
      { new: true, runValidators: true }
    );
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json(dept);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const dept = await Department.findOneAndDelete({ DepartementCode: req.params.code });
    if (!dept) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
