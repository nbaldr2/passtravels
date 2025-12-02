import { Request, Response } from 'express';
import * as passportService from '../services/passport.service';

export const getRankings = async (req: Request, res: Response) => {
    try {
        const rankings = await passportService.getPassportRanking();
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rankings' });
    }
};

export const getPassportDetails = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const passport = await passportService.getPassportByCode(code);
        if (!passport) {
            return res.status(404).json({ error: 'Passport not found' });
        }
        res.json(passport);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch passport details' });
    }
};
