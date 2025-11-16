const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 * @swagger
 * /api/v1/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: +1234567890
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-15
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               blood_group:
 *                 type: string
 *                 example: A+
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Penicillin", "Peanuts"]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
