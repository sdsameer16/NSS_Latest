const express = require('express');
const router = express.Router();
const PeriodConfig = require('../models/PeriodConfig');
const auth = require('../middleware/auth');

// Get current active period configuration
router.get('/active', auth, async (req, res) => {
  try {
    const activeConfig = await PeriodConfig.findOne({ isActive: true });
    res.json(activeConfig);
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
    
    // Deactivate all existing configs
    await PeriodConfig.updateMany({}, { isActive: false });
    
    const newConfig = new PeriodConfig({
      academicYear,
      periods,
      isActive: true
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

// Set active configuration
router.patch('/:id/set-active', auth, async (req, res) => {
  try {
    // Deactivate all configs
    await PeriodConfig.updateMany({}, { isActive: false });
    
    // Activate the specified config
    const activatedConfig = await PeriodConfig.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!activatedConfig) {
      return res.status(404).json({ message: 'Period configuration not found' });
    }
    
    res.json(activatedConfig);
  } catch (error) {
    res.status(500).json({ message: 'Failed to set active configuration' });
  }
});

// Get periods for specific year and time
router.post('/matching-periods', auth, async (req, res) => {
  try {
    const { eventStartTime, eventEndTime, studentYear } = req.body;
    
    const activeConfig = await PeriodConfig.findOne({ isActive: true });
    if (!activeConfig) {
      return res.status(404).json({ message: 'No active period configuration found' });
    }
    
    const yearPeriods = activeConfig.periods[studentYear] || [];
    const matchingPeriods = [];
    
    yearPeriods.forEach(period => {
      const periodStart = parseTime(period.startTime);
      const periodEnd = parseTime(period.endTime);
      const eventStart = parseTime(eventStartTime);
      const eventEnd = parseTime(eventEndTime);
      
      // Check if event overlaps with this period
      if ((eventStart >= periodStart && eventStart < periodEnd) ||
          (eventEnd > periodStart && eventEnd <= periodEnd) ||
          (eventStart <= periodStart && eventEnd >= periodEnd)) {
        matchingPeriods.push(period);
      }
    });
    
    res.json(matchingPeriods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get matching periods' });
  }
});

// Helper function to parse time string (HH:MM) to minutes
function parseTime(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

module.exports = router;
