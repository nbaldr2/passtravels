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

## API Documentation

See main README.md for API endpoints.
