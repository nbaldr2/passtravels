import express from 'express';
import { getRankings, getPassportDetails } from '../controllers/passport.controller';

const router = express.Router();

router.get('/', getRankings);
router.get('/:code', getPassportDetails);

export default router;
