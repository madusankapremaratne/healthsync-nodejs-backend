const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/v1/appointments
 * @desc Get user's appointments
 * @access Private
 */
router.get('/', verifyToken, requireAuth, async (req, res) => {
  try {
    const { Appointment } = require('../models');
    const appointments = await Appointment.findAll({
      where: { user_id: req.user.id },
      order: [['appointment_date', 'ASC']],
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
