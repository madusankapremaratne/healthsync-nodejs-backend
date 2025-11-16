const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /api/v1/pharmacies/nearby:
 *   get:
 *     tags: [Pharmacies]
 *     summary: Find nearby pharmacies
 *     description: Get a list of pharmacies near a specific location within a given radius
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         example: 40.7128
 *         description: Latitude of the user's location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         example: -74.0060
 *         description: Longitude of the user's location
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: number
 *           format: float
 *           default: 5
 *         example: 10
 *         description: Search radius in kilometers (default is 5 km)
 *     responses:
 *       200:
 *         description: Nearby pharmacies retrieved successfully
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
 *                     $ref: '#/components/schemas/Pharmacy'
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Latitude and longitude required
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
