const express = require('express');

const router = express.Router();

/**
 * @route GET /api/v1/pharmacies/nearby
 * @desc Get nearby pharmacies
 * @access Public
 */
router.get('/nearby', async (req, res) => {
  try {
    const { Pharmacy } = require('../models');
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required',
      });
    }

    // Simple distance calculation (can be improved with PostGIS)
    const pharmacies = await Pharmacy.findAll({
      where: { is_active: true },
      limit: 10,
    });

    res.json({
      success: true,
      data: pharmacies,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
