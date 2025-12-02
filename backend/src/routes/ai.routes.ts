import express from 'express';
import { planTrip, optimizeRoute, getHotels } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/plan-trip', authenticate, planTrip);
router.post('/optimize-route', authenticate, optimizeRoute);
router.get('/hotels', getHotels);

export default router;
