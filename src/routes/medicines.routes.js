const express = require('express');

const router = express.Router();

/**
 * @swagger
 * /api/v1/medicines/search:
 *   get:
 *     tags: [Medicines]
 *     summary: Search for medicines
 *     description: Search medicines by generic name or brand name
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         example: aspirin
 *         description: Search query to match against medicine names (generic or brand)
 *     responses:
 *       200:
 *         description: Medicines found successfully
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
 *                     $ref: '#/components/schemas/Medicine'
 *       400:
 *         description: Missing search query
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
 *                   example: Search query required
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
