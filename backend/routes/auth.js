const express = require('express');
const router = express.Router();

const USER = { username: 'admin', password: 'admin123' };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = { username };
    return res.json({ message: 'Login successful', user: { username } });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ message: 'Not authenticated' });
});

module.exports = router;
