const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/v1/visits
 * @desc Get user's doctor visits
 * @access Private
 */
router.get('/', verifyToken, requireAuth, async (req, res) => {
  try {
    const { DoctorVisit } = require('../models');
    const visits = await DoctorVisit.findAll({
      where: { user_id: req.user.id },
      order: [['visit_date', 'DESC']],
    });

    res.json({
      success: true,
      data: visits,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/visits
 * @desc Create new doctor visit
 * @access Private
 */
router.post('/', verifyToken, requireAuth, async (req, res) => {
  try {
    const { DoctorVisit } = require('../models');
    const visit = await DoctorVisit.create({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Visit recorded successfully',
      data: visit,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
