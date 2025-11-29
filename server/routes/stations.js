const express = require('express');
const router = express.Router();
const PollingStation = require('../models/PollingStation');

// GET all polling stations
router.get('/', async (req, res) => {
  try {
    const stations = await PollingStation.find().populate('officialInCharge', 'name email');
    res.json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET polling station by ID
router.get('/:id', async (req, res) => {
  try {
    const station = await PollingStation.findById(req.params.id).populate('officialInCharge', 'name email');
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Polling station not found',
      });
    }
    res.json({
      success: true,
      data: station,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE new polling station
router.post('/', async (req, res) => {
  try {
    const { name, location, capacity, votingHours, officialInCharge } = req.body;

    const station = new PollingStation({
      name,
      location,
      capacity,
      votingHours,
      officialInCharge,
    });

    await station.save();
    await station.populate('officialInCharge', 'name email');

    res.status(201).json({
      success: true,
      message: 'Polling station created successfully',
      data: station,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE polling station
router.put('/:id', async (req, res) => {
  try {
    const { name, location, capacity, currentCrowdLevel, votingHours, isOpen, votersTurnout } = req.body;

    const station = await PollingStation.findByIdAndUpdate(
      req.params.id,
      { name, location, capacity, currentCrowdLevel, votingHours, isOpen, votersTurnout },
      { new: true, runValidators: true }
    ).populate('officialInCharge', 'name email');

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Polling station not found',
      });
    }

    res.json({
      success: true,
      message: 'Polling station updated successfully',
      data: station,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE polling station
router.delete('/:id', async (req, res) => {
  try {
    const station = await PollingStation.findByIdAndDelete(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Polling station not found',
      });
    }

    res.json({
      success: true,
      message: 'Polling station deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE crowd level for a polling station
router.patch('/:id/crowd-level', async (req, res) => {
  try {
    const { currentCrowdLevel } = req.body;

    // Validate crowd level
    if (!['low', 'medium', 'high'].includes(currentCrowdLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid crowd level. Must be: low, medium, or high',
      });
    }

    const station = await PollingStation.findByIdAndUpdate(
      req.params.id,
      {
        currentCrowdLevel,
        lastCrowdLevelUpdate: new Date(),
      },
      { new: true, runValidators: true }
    ).populate('officialInCharge', 'name email');

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Polling station not found',
      });
    }

    res.json({
      success: true,
      message: 'Crowd level updated successfully',
      data: station,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET stations by crowd level
router.get('/filter/crowd-level/:level', async (req, res) => {
  try {
    const { level } = req.params;

    if (!['low', 'medium', 'high'].includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid crowd level. Must be: low, medium, or high',
      });
    }

    const stations = await PollingStation.find({ currentCrowdLevel: level })
      .populate('officialInCharge', 'name email');

    res.json({
      success: true,
      count: stations.length,
      data: stations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
