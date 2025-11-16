const express = require('express');
const { verifyToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/visits:
 *   get:
 *     tags: [Doctor Visits]
 *     summary: Get all doctor visits
 *     description: Retrieve all doctor visits for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor visits retrieved successfully
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
 *                     $ref: '#/components/schemas/DoctorVisit'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 * @swagger
 * /api/v1/visits:
 *   post:
 *     tags: [Doctor Visits]
 *     summary: Create new doctor visit record
 *     description: Record a new doctor visit for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_name
 *               - visit_date
 *             properties:
 *               doctor_name:
 *                 type: string
 *                 example: Dr. Sarah Johnson
 *               specialty:
 *                 type: string
 *                 example: Cardiology
 *               visit_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T10:30:00Z
 *               diagnosis:
 *                 type: string
 *                 example: Mild hypertension
 *               notes:
 *                 type: string
 *                 example: Patient advised to reduce salt intake
 *               follow_up_date:
 *                 type: string
 *                 format: date
 *                 example: 2024-02-15
 *     responses:
 *       201:
 *         description: Visit recorded successfully
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
 *                   example: Visit recorded successfully
 *                 data:
 *                   $ref: '#/components/schemas/DoctorVisit'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
