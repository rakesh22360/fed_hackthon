const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('pollingStation', 'name location')
      .populate('verifiedBy', 'name email');
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('pollingStation', 'name location')
      .populate('verifiedBy', 'name email');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }
    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE new report
router.post('/', async (req, res) => {
  try {
    const { reporter, pollingStation, type, description, severity, crowdLevel } = req.body;

    const report = new Report({
      reporter,
      pollingStation,
      type,
      description,
      severity,
      crowdLevel,
    });

    await report.save();
    await report.populate('reporter', 'name email');
    await report.populate('pollingStation', 'name location');

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE report
router.put('/:id', async (req, res) => {
  try {
    const { status, severity, isVerified, verifiedBy } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, severity, isVerified, verifiedBy },
      { new: true, runValidators: true }
    )
      .populate('reporter', 'name email')
      .populate('pollingStation', 'name location')
      .populate('verifiedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET reports by polling station
router.get('/station/:stationId', async (req, res) => {
  try {
    const reports = await Report.find({ pollingStation: req.params.stationId })
      .populate('reporter', 'name email')
      .populate('verifiedBy', 'name email');
    
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET reports by user
router.get('/user/:userId', async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.params.userId })
      .populate('pollingStation', 'name location')
      .populate('verifiedBy', 'name email');
    
    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
