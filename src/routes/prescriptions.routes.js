const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/prescriptions:
 *   get:
 *     tags: [Prescriptions]
 *     summary: Get all prescriptions
 *     description: Retrieve all prescriptions for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prescriptions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Prescription'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
