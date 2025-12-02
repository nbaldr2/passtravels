import { Request, Response } from 'express';
import * as countryService from '../services/country.service';
import { checkVisaRequirements } from '../services/passport.service';

export const listCountries = async (req: Request, res: Response) => {
    try {
        const countries = await countryService.listCountries();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
};

export const getCountryDetails = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const country = await countryService.getCountryByCode(code);
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch country details' });
    }
};

export const getVisaRequirements = async (req: Request, res: Response) => {
    try {
        const { passportCode, countryCode } = req.params;
        // Try external API if configured
        let result: any = null;
        try {
            result = await checkVisaRequirements(passportCode, countryCode);
        } catch (e) {
            // Continue to DB fallback
            result = null;
        }

        if (!result) {
            const rule = await countryService.getVisaRule(passportCode, countryCode);
            return res.json(rule);
        }

        // Normalize external API format to match our rule shape
        return res.json({
            type: result.type || 'unknown',
            duration: result.duration ?? undefined,
            notes: result.notes ?? undefined
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch visa requirements' });
    }
};
