import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Travel Visa Intelligence API is running');
});

import authRoutes from './routes/auth.routes';
import passportRoutes from './routes/passport.routes';
import countryRoutes from './routes/country.routes';
import aiRoutes from './routes/ai.routes';
import userRoutes from './routes/user.routes';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passports', passportRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
