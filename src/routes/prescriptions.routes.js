const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/v1/prescriptions
 * @desc Get user's prescriptions
 * @access Private
 */
router.get('/', verifyToken, requireAuth, async (req, res) => {
  try {
    const { Prescription } = require('../models');
    const prescriptions = await Prescription.findAll({
      where: { user_id: req.user.id },
      order: [['start_date', 'DESC']],
    });

    res.json({
      success: true,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
