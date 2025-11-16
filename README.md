# HealthSync Backend API

A comprehensive Node.js Express backend for the HealthSync digital health management platform. This API handles patient records, prescriptions, appointments, and pharmacy integrations with HIPAA compliance.

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Database Architecture](#database-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Running the Application](#running-the-application)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

HealthSync Backend provides a robust REST API for:
- User authentication and authorization
- Doctor visit tracking and prescription management
- Appointment booking with Doc990 and eChannelling integration
- Pharmacy search and medicine price comparison
- Real-time notifications and reminders
- HIPAA-compliant data storage

## Technology Stack

### Backend Framework
- **Node.js** 16+ (JavaScript runtime)
- **Express.js** 4.18+ (Web framework)
- **Sequelize** 6.35+ (ORM)

### Database
- **PostgreSQL** 14+ (Primary relational database)
- **Redis** 7+ (Caching and session management)

### Authentication & Security
- **JWT** (JSON Web Tokens)
- **bcryptjs** (Password hashing)
- **Helmet** (Security headers)
- **CORS** (Cross-Origin Resource Sharing)

### Additional Libraries
- **Multer** (File upload handling)
- **Sharp** (Image processing)
- **Node-cron** (Scheduled tasks)
- **Winston** (Logging)
- **Joi** (Data validation)
- **Axios** (HTTP client)

## Database Architecture

### Primary Database: PostgreSQL 14+

HealthSync uses PostgreSQL as the primary relational database with the following core entities:

#### Core Tables

1. **users**
   - User accounts and authentication
   - Profile information
   - Health preferences and emergency contacts

2. **doctor_visits**
   - Medical consultation records
   - Diagnosis and treatment notes
   - Prescription images (OCR)

3. **prescriptions**
   - Medication records
   - Dosage and frequency information
   - Refill tracking

4. **doctors**
   - Doctor information and specialties
   - Integration with Doc990 and eChannelling

5. **appointments**
   - Appointment booking records
   - Status tracking
   - Integration with booking platforms

6. **pharmacies**
   - Pharmacy location and contact information
   - Operating hours and delivery details
   - API integration status

7. **medicines**
   - Medicine catalog
   - Strength and form information
   - Contraindications and side effects

8. **medicine_inventory**
   - Pharmacy-specific inventory
   - Pricing and stock information
   - Batch and expiry tracking

### Caching Layer: Redis 7+

Redis is used for:
- Session management and authentication tokens
- Real-time notifications queue
- Appointment reminders
- Geospatial indexing for nearby pharmacies

## Getting Started

### Prerequisites

- **Node.js**: 16+ ([Download](https://nodejs.org/))
- **PostgreSQL**: 14+ ([Download](https://www.postgresql.org/download/))
- **Redis**: 7+ ([Download](https://redis.io/download))
- **npm**: 8+ (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/healthsync-backend.git
   cd healthsync-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Configuration](#environment-configuration))

5. **Create databases**
   ```bash
   psql -U postgres
   CREATE DATABASE healthsync_db;
   CREATE DATABASE healthsync_test;
   ```

6. **Run migrations**
   ```bash
   npm run migrate
   ```

7. **Seed sample data** (optional)
   ```bash
   npm run seed
   ```

## Environment Configuration

### Required Variables

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthsync_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Third-Party APIs
DOC990_API_KEY=your_key
ECHANNELLING_API_KEY=your_key

# Security
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

See `.env.example` for complete configuration options.

## Project Structure

```
healthsync-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Sequelize database config
│   │   └── redis.js         # Redis configuration
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   ├── DoctorVisit.js
│   │   ├── Prescription.js
│   │   ├── Appointment.js
│   │   ├── Pharmacy.js
│   │   └── index.js         # Model associations
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── visits.routes.js
│   │   ├── prescriptions.routes.js
│   │   ├── appointments.routes.js
│   │   ├── pharmacies.routes.js
│   │   └── medicines.routes.js
│   ├── middleware/          # Express middleware
│   │   └── auth.js          # Authentication middleware
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   │   └── logger.js        # Winston logger
│   └── index.js             # Application entry point
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── tests/                   # Test files
├── logs/                    # Application logs
├── .env.example             # Environment template
├── package.json
└── README.md
```

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "phone": "+94712345678"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

### User Endpoints

#### Get Profile
```
GET /api/v1/users/profile
Authorization: Bearer {accessToken}
```

#### Update Profile
```
PUT /api/v1/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "phone": "+94712345678",
  "blood_group": "O+",
  "allergies": ["Penicillin"]
}
```

### Doctor Visit Endpoints

#### Get All Visits
```
GET /api/v1/visits
Authorization: Bearer {accessToken}
```

#### Create Visit
```
POST /api/v1/visits
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "doctor_name": "Dr. Smith",
  "visit_date": "2024-01-15T10:00:00Z",
  "reason": "Regular checkup",
  "diagnosis": "Healthy"
}
```

### Prescription Endpoints

#### Get Prescriptions
```
GET /api/v1/prescriptions
Authorization: Bearer {accessToken}
```

### Appointment Endpoints

#### Get Appointments
```
GET /api/v1/appointments
Authorization: Bearer {accessToken}
```

### Pharmacy Endpoints

#### Get Nearby Pharmacies
```
GET /api/v1/pharmacies/nearby?latitude=6.9271&longitude=80.7789&radius=5
```

### Medicine Endpoints

#### Search Medicines
```
GET /api/v1/medicines/search?q=paracetamol
```

## Authentication

HealthSync uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**
   - Validity: 24 hours
   - Use: Include in `Authorization: Bearer {token}` header

2. **Refresh Token**
   - Validity: 7 days
   - Use: Obtain new access token when expired

### Token Refresh Flow

```
POST /api/v1/auth/refresh
{
  "refreshToken": "old_refresh_token"
}

→ Returns new accessToken and refreshToken
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Starts with `nodemon` for automatic restart on file changes.

### Production Mode

```bash
npm start
```

### Health Check

```bash
curl http://localhost:3000/health
```

## Database Migrations

### Create Migration

```bash
npx sequelize-cli migration:generate --name add_new_field
```

### Run Migrations

```bash
npm run migrate
```

### Seed Database

```bash
npm run seed
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npm test -- tests/auth.test.js
```

## Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t healthsync-backend .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env healthsync-backend
   ```

### Heroku Deployment

1. **Install Heroku CLI**

2. **Login**
   ```bash
   heroku login
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### AWS EC2 Deployment

1. **Connect to instance**
2. **Install Node.js and PostgreSQL**
3. **Clone repository**
4. **Configure environment variables**
5. **Start application with PM2**

## Contributing

### Code Style

- Use ESLint for code quality
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code

### Git Workflow

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am 'Add new feature'`
3. Push branch: `git push origin feature/my-feature`
4. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create GitHub issue
- Email: support@healthsync.com
- Documentation: https://docs.healthsync.com

---

**HealthSync Backend API v1.0.0**
Built with ❤️ for better healthcare in Sri Lanka
