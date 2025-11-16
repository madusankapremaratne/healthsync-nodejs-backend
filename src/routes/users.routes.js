const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/v1/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', verifyToken, requireAuth, async (req, res) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route PUT /api/v1/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', verifyToken, requireAuth, async (req, res) => {
  try {
    const { User } = require('../models');
    const { full_name, phone, date_of_birth, gender, blood_group, allergies } = req.body;
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({
      full_name,
      phone,
      date_of_birth,
      gender,
      blood_group,
      allergies,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
