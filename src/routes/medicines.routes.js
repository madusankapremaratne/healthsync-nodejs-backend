const express = require('express');

const router = express.Router();

/**
 * @route GET /api/v1/medicines/search
 * @desc Search for medicines
 * @access Public
 */
router.get('/search', async (req, res) => {
  try {
    const { Medicine } = require('../models');
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query required',
      });
    }

    const medicines = await Medicine.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { generic_name: { [require('sequelize').Op.iLike]: `%${q}%` } },
          { brand_name: { [require('sequelize').Op.iLike]: `%${q}%` } },
        ],
      },
      limit: 20,
    });

    res.json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
