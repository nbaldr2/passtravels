# PassTravels - Travel Visa & Passport Intelligence App

A cross-platform mobile application built with React Native (Expo) that provides passport ranking, visa requirements, eVisa links, and AI-powered travel planning.

## 🚀 Features

- **Passport Intelligence**: View global passport rankings and mobility scores
- **Visa Requirements**: Check visa-free, visa-on-arrival, eVisa, and visa-required countries
- **AI Travel Planner**: Generate smart trip itineraries with budget optimization
- **Interactive Map**: Visualize visa requirements globally (Mapbox integration)
- **User Accounts**: Save trips, favorites, and manage multiple passports
- **Real-time Data**: Integration with Travel Buddy API and Google Gemini AI

## 📁 Project Structure

```
/
├── mobile/                 # React Native Expo App
│   ├── app/                # Expo Router screens
│   │   ├── (tabs)/         # Tab navigation screens
│   │   └── auth/           # Authentication screens
│   ├── components/         # Reusable UI components
│   ├── services/           # API services (Axios)
│   ├── store/              # Zustand state management
│   └── utils/              # Helper functions
├── backend/                # Node.js Express API
│   ├── src/
│   │   ├── controllers/    # Route logic
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation
│   │   └── utils/          # Utilities
│   └── prisma/             # Database schema
```

## 🛠️ Tech Stack

### Frontend (Mobile)
- React Native (Expo SDK 54)
- NativeWind (Tailwind CSS for React Native)
- Expo Router (File-based routing)
- Zustand (State management)
- Axios (API client)
- Expo Secure Store (Token storage)
- Mapbox React Native SDK

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- TypeScript

### APIs
- Travel Buddy API (Passport & Visa data)
- Google Gemini API (AI travel planning)
- RestCountries API (Country data fallback)

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL
- Expo CLI
- iOS Simulator / Android Emulator

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Generate Prisma client
npx prisma generate

# Run migrations (when database is ready)
npx prisma migrate dev

# Start development server
npm run dev
```

### Mobile Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

## 🔑 Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/passtravels"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_api_key"
TRAVEL_BUDDY_API_KEY="your_travel_buddy_key"
```

### Mobile
Update API base URL in `mobile/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🎨 Design Features

- **Dark Mode**: Premium dark theme with vibrant gradients
- **Glassmorphism**: Modern UI with translucent effects
- **Smooth Animations**: React Native Reanimated 3
- **Responsive**: Optimized for all screen sizes

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Passports
- `GET /api/passports` - Get all passport rankings
- `GET /api/passports/:code` - Get passport details

### Countries
- `GET /api/countries/:code` - Get country details
- `GET /api/countries/visa/:passportCode/:countryCode` - Get visa requirements

### AI Planning
- `POST /api/ai/plan-trip` - Generate trip itinerary
- `POST /api/ai/optimize-route` - Optimize multi-country route

## 🚢 Deployment

### Backend
```bash
npm run build
npm start
```

### Mobile (EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📄 License

MIT

## 👥 Authors

Built with ❤️ by the PassTravels team
