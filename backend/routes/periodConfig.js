const express = require('express');
const router = express.Router();
const PeriodConfig = require('../models/PeriodConfig');
const { auth } = require('../middleware/auth');

// Get current active period configuration (for backward compatibility)
router.get('/active', auth, async (req, res) => {
  try {
    // Return the most recent configuration as "active"
    const activeConfig = await PeriodConfig.findOne().sort({ createdAt: -1 });
    res.json(activeConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch period configuration' });
  }
});

// Get period configuration by academic year
router.get('/academic-year/:year', auth, async (req, res) => {
  try {
    const config = await PeriodConfig.findOne({ academicYear: req.params.year });
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch period configuration' });
  }
});

// Get all period configurations
router.get('/', auth, async (req, res) => {
  try {
    const configs = await PeriodConfig.find().sort({ academicYear: -1 });
    res.json(configs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch period configurations' });
  }
});

// Create new period configuration
router.post('/', auth, async (req, res) => {
  try {
    const { academicYear, periods } = req.body;
    
    const newConfig = new PeriodConfig({
      academicYear,
      periods
    });
    
    await newConfig.save();
    res.status(201).json(newConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create period configuration' });
  }
});

// Update period configuration
router.put('/:id', auth, async (req, res) => {
  try {
    const { academicYear, periods } = req.body;
    
    const updatedConfig = await PeriodConfig.findByIdAndUpdate(
      req.params.id,
      { academicYear, periods },
      { new: true }
    );
    
    if (!updatedConfig) {
      return res.status(404).json({ message: 'Period configuration not found' });
    }
    
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update period configuration' });
  }
});

// Set active configuration (for backward compatibility)
router.patch('/:id/set-active', auth, async (req, res) => {
  try {
    // For backward compatibility, just return the config as "active"
    const activatedConfig = await PeriodConfig.findById(req.params.id);
    
    if (!activatedConfig) {
      return res.status(404).json({ message: 'Period configuration not found' });
    }
    
    // Set this config as active and deactivate others
    await PeriodConfig.updateMany({}, { isActive: false });
    await PeriodConfig.findByIdAndUpdate(req.params.id, { isActive: true });
    
    const updatedConfig = await PeriodConfig.findById(req.params.id);
    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to set active configuration' });
  }
});

module.exports = router;
