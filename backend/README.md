# PassTravels Backend

Node.js + Express + PostgreSQL backend for the PassTravels mobile app.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server

## Docker Setup

We provide a complete Docker environment for both development and production.

### Quick Start
```bash
# Start production environment
npm run docker:up

# Start development environment (with hot-reload)
npm run docker:dev
```

For detailed instructions, see [DOCKER.md](DOCKER.md).

## API Documentation

See main README.md for API endpoints.
