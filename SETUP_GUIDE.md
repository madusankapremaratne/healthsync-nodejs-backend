# HealthSync Backend - Complete Setup Guide

This guide will walk you through setting up the HealthSync backend from scratch.

## Prerequisites

Before starting, ensure you have installed:

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/))
- **Redis** 7+ ([Download](https://redis.io/))
- **Git** ([Download](https://git-scm.com/))
- **npm** 8+ (comes with Node.js)

### Mac Setup (using Homebrew)
```bash
brew install node postgresql redis
```

### Ubuntu/Debian Setup
```bash
sudo apt update
sudo apt install nodejs npm postgresql redis-server
```

### Windows Setup
Download and install each component from their respective websites, or use Chocolatey:
```bash
choco install nodejs postgresql redis
```

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/healthsync-backend.git
cd healthsync-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL

#### Start PostgreSQL (if not running)

**Mac/Linux:**
```bash
pg_ctl -D /usr/local/var/postgres start
```

**Ubuntu/Debian:**
```bash
sudo service postgresql start
```

**Windows:**
- PostgreSQL starts automatically after installation

#### Create Databases

```bash
# Connect to PostgreSQL
psql -U postgres

# Create development database
CREATE DATABASE healthsync_db;

# Create test database
CREATE DATABASE healthsync_test;

# Verify databases created
\l

# Exit psql
\q
```

### 4. Setup Redis

#### Start Redis (if not running)

**Mac/Linux:**
```bash
redis-server
```

**Ubuntu/Debian:**
```bash
sudo service redis-server start
```

**Windows:**
- Redis should start automatically, or use WSL2

### 5. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthsync_db
DB_USER=postgres
DB_PASSWORD=postgres  # Change this!

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (Generate secure keys)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

### 6. Run Database Migrations

```bash
npm run migrate
```

This will create all tables defined in the models.

### 7. Seed Sample Data (Optional)

```bash
npm run seed
```

This populates the database with sample data for testing.

### 8. Start Development Server

```bash
npm run dev
```

You should see output like:
```
✓ PostgreSQL Database connected successfully
✓ Redis cache connected successfully
✓ HealthSync API Server running on port 3000
✓ Environment: development
```

### 9. Verify Setup

Test the API with curl or Postman:

```bash
# Health check
curl http://localhost:3000/health

# Response should be:
# {"status":"OK","timestamp":"2024-01-15T10:00:00.000Z","uptime":5.123}
```

## Docker Setup (Alternative)

If you prefer Docker, use Docker Compose:

### 1. Install Docker

- **Mac/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### 2. Start Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- API server on port 3000
- Adminer (database UI) on port 8080

### 3. Run Migrations

```bash
docker-compose exec api npm run migrate
```

### 4. View Logs

```bash
docker-compose logs -f api
```

### 5. Stop Services

```bash
docker-compose down
```

## Verify Installation

### 1. Test Authentication

Register a new user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User",
    "phone": "+94712345678"
  }'
```

You should receive a response with `accessToken` and `refreshToken`.

### 2. Test Protected Route

```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Check Database

Using Adminer (port 8080) or psql:
```bash
psql -U postgres -d healthsync_db -c "\dt"
```

You should see tables like `users`, `doctor_visits`, `prescriptions`, etc.

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Ensure PostgreSQL is running: `pg_isready`
2. Verify connection parameters in `.env`
3. Check if database exists: `psql -U postgres -l`

### Redis Connection Error

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solution:**
1. Ensure Redis is running: `redis-cli ping`
2. Should respond with `PONG`
3. Check Redis host/port in `.env`

### Port Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### Code Style

```bash
# Lint code
npm run lint

# Auto-format code
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/auth.test.js

# Run with coverage
npm test -- --coverage
```

### Database Management

```bash
# Connect to development database
psql -U postgres -d healthsync_db

# Create new table
CREATE TABLE example (...);

# View all tables
\dt

# Backup database
pg_dump healthsync_db > backup.sql

# Restore database
psql healthsync_db < backup.sql
```

## Next Steps

1. **Read API Documentation**: Check `README.md` for complete API reference
2. **Setup Frontend**: Clone and setup the frontend repository
3. **Configure Third-Party APIs**: 
   - Doc990 API integration
   - eChannelling API integration
   - Google Cloud Vision for OCR
   - Twilio for SMS
4. **Deploy to Production**: Follow deployment guide

## Need Help?

- **Issues**: Create GitHub issue with details
- **Questions**: Email support@healthsync.com
- **Documentation**: https://docs.healthsync.com

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run migrate` | Run database migrations |
| `npm run seed` | Seed sample data |
| `npm run lint` | Check code style |
| `npm run format` | Auto-format code |

---

**Ready to build something amazing!** 🚀
