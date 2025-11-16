require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const { createRedisClient } = require('./config/redis');
const { Sequelize } = require('sequelize');
const dbConfig = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Initialize Express
const app = express();

// Middleware Configuration
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Database initialization
let sequelize;
let redisClient;

const initializeDatabase = async () => {
  try {
    const env = process.env.NODE_ENV || 'development';
    const config = dbConfig[env];

    sequelize = new Sequelize(config.database, config.username, config.password, config);
    await sequelize.authenticate();
    logger.info('✓ PostgreSQL Database connected successfully');
    return sequelize;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
};

const initializeRedis = async () => {
  try {
    redisClient = await createRedisClient();
    logger.info('✓ Redis cache connected successfully');
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Don't throw - Redis is optional for MVP
  }
};

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HealthSync API Documentation',
}));

// API Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/users.routes'));
app.use('/api/v1/visits', require('./routes/visits.routes'));
app.use('/api/v1/prescriptions', require('./routes/prescriptions.routes'));
app.use('/api/v1/appointments', require('./routes/appointments.routes'));
app.use('/api/v1/pharmacies', require('./routes/pharmacies.routes'));
app.use('/api/v1/medicines', require('./routes/medicines.routes'));

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check endpoint
 *     description: Check if the API server is running and healthy
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 3600.5
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Server startup
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize Redis (optional)
    await initializeRedis();

    // Start listening
    app.listen(PORT, () => {
      logger.info(`✓ HealthSync API Server running on port ${PORT}`);
      logger.info(`✓ Environment: ${process.env.NODE_ENV}`);
      logger.info(`✓ API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  if (sequelize) {
    await sequelize.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  if (sequelize) {
    await sequelize.close();
  }
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { app, sequelize, redisClient };
