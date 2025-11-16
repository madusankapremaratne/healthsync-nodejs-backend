const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Get all appointments
 *     description: Retrieve all appointments for the authenticated user, sorted by appointment date
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
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
 *                     $ref: '#/components/schemas/Appointment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
