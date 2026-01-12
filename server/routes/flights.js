const express = require('express');
const Flight = require('../models/Flight');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const flights = await Flight.aggregate([{ $sample: { size: 10 } }]);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;