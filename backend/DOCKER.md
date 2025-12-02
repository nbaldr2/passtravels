# PassTravels Backend - Docker Guide

## 🐳 Docker Setup

This backend is fully containerized with Docker for easy deployment and development.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

## Quick Start

### Production Mode

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Build and run:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

### Development Mode

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Build and run with hot-reload:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

3. **Stop services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## 📦 Services

### Backend Service
- **Port:** 3000
- **Container Name:** passtravels-backend
- **Features:**
  - Multi-stage build for optimized image size
  - Automatic Prisma migrations on startup
  - Health checks
  - Production-ready configuration

### PostgreSQL Database
- **Port:** 51214 (mapped to 5432 inside container)
- **Container Name:** passtravels-postgres
- **Credentials:**
  - User: user
  - Password: password
  - Database: passtravels

## 🔧 Common Commands

### Build without cache
```bash
docker-compose build --no-cache
```

### View running containers
```bash
docker-compose ps
```

### Execute commands in backend container
```bash
docker-compose exec backend sh
```

### Run Prisma commands
```bash
# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx prisma db seed
```

### Database Management

#### Access PostgreSQL CLI
```bash
docker-compose exec postgres psql -U user -d passtravels
```

#### Backup database
```bash
docker-compose exec postgres pg_dump -U user passtravels > backup.sql
```

#### Restore database
```bash
docker-compose exec -T postgres psql -U user passtravels < backup.sql
```

### Clean up everything (including volumes)
```bash
docker-compose down -v
```

## 🌍 Environment Variables

Required environment variables (set in `.env`):

```env
PORT=3000
DATABASE_URL="postgresql://user:password@postgres:5432/passtravels?schema=public"
JWT_SECRET="your_jwt_secret_here"
GEMINI_API_KEY="your_gemini_api_key_here"
TRAVEL_BUDDY_API_KEY="your_travel_buddy_api_key_here"
```

## 🚀 Deployment

### Deploy to Production Server

1. **Copy files to server:**
   ```bash
   scp -r . user@server:/path/to/app
   ```

2. **SSH into server:**
   ```bash
   ssh user@server
   cd /path/to/app
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

4. **Start services:**
   ```bash
   docker-compose up -d
   ```

### Using Docker Hub

1. **Build and tag image:**
   ```bash
   docker build -t yourusername/passtravels-backend:latest .
   ```

2. **Push to Docker Hub:**
   ```bash
   docker push yourusername/passtravels-backend:latest
   ```

3. **Pull and run on server:**
   ```bash
   docker pull yourusername/passtravels-backend:latest
   docker-compose up -d
   ```

## 🔍 Troubleshooting

### Backend won't start
- Check logs: `docker-compose logs backend`
- Ensure PostgreSQL is healthy: `docker-compose ps`
- Verify environment variables are set correctly

### Database connection issues
- Ensure DATABASE_URL uses `postgres` as hostname (not `localhost`)
- Check if PostgreSQL container is running: `docker-compose ps postgres`
- Verify credentials match in docker-compose.yml and .env

### Port already in use
- Change port mapping in docker-compose.yml
- Example: `"3001:3000"` to use port 3001 on host

### Prisma migration issues
- Run migrations manually: `docker-compose exec backend npx prisma migrate deploy`
- Reset database: `docker-compose exec backend npx prisma migrate reset`

## 📊 Monitoring

### View resource usage
```bash
docker stats passtravels-backend passtravels-postgres
```

### Health check status
```bash
docker inspect --format='{{json .State.Health}}' passtravels-backend
```

## 🔐 Security Best Practices

1. **Never commit `.env` file**
2. **Use strong JWT_SECRET in production**
3. **Change default PostgreSQL credentials**
4. **Use Docker secrets for sensitive data in production**
5. **Regularly update base images**

## 📝 Notes

- The production Dockerfile uses multi-stage builds to minimize image size
- Prisma migrations run automatically on container startup
- Health checks ensure the backend is responding before marking as healthy
- Volumes persist data even when containers are stopped
