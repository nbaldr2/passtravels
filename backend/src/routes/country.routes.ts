import express from 'express';
import { listCountries, getCountryDetails, getVisaRequirements } from '../controllers/country.controller';

const router = express.Router();

router.get('/', listCountries);
router.get('/visa/:passportCode/:countryCode', getVisaRequirements);
router.get('/:code', getCountryDetails);

export default router;
