import axios from 'axios';

const TRAVEL_BUDDY_API_KEY = process.env.TRAVEL_BUDDY_API_KEY || '';
const TRAVEL_BUDDY_BASE_URL = 'https://api.travel-buddy.ai/v2';

interface PassportRanking {
    countryCode: string;
    rank: number;
    mobilityScore: number;
    countryName?: string;
}

// Fallback mock data if API fails - Expanded to 63 countries
const MOCK_PASSPORTS: PassportRanking[] = [
    // Asia
    { countryCode: 'JP', rank: 1, mobilityScore: 193, countryName: 'Japan' },
    { countryCode: 'SG', rank: 1, mobilityScore: 193, countryName: 'Singapore' },
    { countryCode: 'KR', rank: 2, mobilityScore: 192, countryName: 'South Korea' },
    { countryCode: 'AE', rank: 15, mobilityScore: 178, countryName: 'United Arab Emirates' },
    { countryCode: 'IL', rank: 22, mobilityScore: 159, countryName: 'Israel' },
    { countryCode: 'TR', rank: 52, mobilityScore: 110, countryName: 'Turkey' },
    { countryCode: 'QA', rank: 55, mobilityScore: 100, countryName: 'Qatar' },
    { countryCode: 'SA', rank: 61, mobilityScore: 82, countryName: 'Saudi Arabia' },
    { countryCode: 'TH', rank: 64, mobilityScore: 79, countryName: 'Thailand' },
    { countryCode: 'CN', rank: 66, mobilityScore: 80, countryName: 'China' },
    { countryCode: 'ID', rank: 71, mobilityScore: 71, countryName: 'Indonesia' },
    { countryCode: 'PH', rank: 74, mobilityScore: 66, countryName: 'Philippines' },
    { countryCode: 'IN', rank: 80, mobilityScore: 57, countryName: 'India' },
    { countryCode: 'VN', rank: 87, mobilityScore: 55, countryName: 'Vietnam' },
    { countryCode: 'PK', rank: 100, mobilityScore: 32, countryName: 'Pakistan' },
    { countryCode: 'BD', rank: 96, mobilityScore: 40, countryName: 'Bangladesh' },
    { countryCode: 'MY', rank: 11, mobilityScore: 180, countryName: 'Malaysia' },

    // Europe
    { countryCode: 'DE', rank: 2, mobilityScore: 192, countryName: 'Germany' },
    { countryCode: 'ES', rank: 3, mobilityScore: 191, countryName: 'Spain' },
    { countryCode: 'IT', rank: 3, mobilityScore: 191, countryName: 'Italy' },
    { countryCode: 'FR', rank: 3, mobilityScore: 191, countryName: 'France' },
    { countryCode: 'GB', rank: 4, mobilityScore: 190, countryName: 'United Kingdom' },
    { countryCode: 'NL', rank: 4, mobilityScore: 189, countryName: 'Netherlands' },
    { countryCode: 'SE', rank: 4, mobilityScore: 189, countryName: 'Sweden' },
    { countryCode: 'DK', rank: 4, mobilityScore: 189, countryName: 'Denmark' },
    { countryCode: 'AT', rank: 4, mobilityScore: 189, countryName: 'Austria' },
    { countryCode: 'PT', rank: 5, mobilityScore: 188, countryName: 'Portugal' },
    { countryCode: 'IE', rank: 5, mobilityScore: 188, countryName: 'Ireland' },
    { countryCode: 'BE', rank: 6, mobilityScore: 187, countryName: 'Belgium' },
    { countryCode: 'NO', rank: 6, mobilityScore: 187, countryName: 'Norway' },
    { countryCode: 'CH', rank: 6, mobilityScore: 187, countryName: 'Switzerland' },
    { countryCode: 'CZ', rank: 6, mobilityScore: 187, countryName: 'Czech Republic' },
    { countryCode: 'FI', rank: 3, mobilityScore: 191, countryName: 'Finland' },
    { countryCode: 'PL', rank: 8, mobilityScore: 185, countryName: 'Poland' },
    { countryCode: 'HU', rank: 8, mobilityScore: 185, countryName: 'Hungary' },
    { countryCode: 'GR', rank: 7, mobilityScore: 186, countryName: 'Greece' },
    { countryCode: 'RO', rank: 13, mobilityScore: 177, countryName: 'Romania' },

    // Americas
    { countryCode: 'US', rank: 7, mobilityScore: 187, countryName: 'United States' },
    { countryCode: 'CA', rank: 7, mobilityScore: 186, countryName: 'Canada' },
    { countryCode: 'CL', rank: 15, mobilityScore: 175, countryName: 'Chile' },
    { countryCode: 'AR', rank: 18, mobilityScore: 170, countryName: 'Argentina' },
    { countryCode: 'BR', rank: 19, mobilityScore: 169, countryName: 'Brazil' },
    { countryCode: 'MX', rank: 23, mobilityScore: 160, countryName: 'Mexico' },
    { countryCode: 'UY', rank: 26, mobilityScore: 154, countryName: 'Uruguay' },
    { countryCode: 'CO', rank: 37, mobilityScore: 133, countryName: 'Colombia' },
    { countryCode: 'VE', rank: 42, mobilityScore: 125, countryName: 'Venezuela' },
    { countryCode: 'PE', rank: 34, mobilityScore: 138, countryName: 'Peru' },

    // Oceania
    { countryCode: 'NZ', rank: 5, mobilityScore: 188, countryName: 'New Zealand' },
    { countryCode: 'AU', rank: 6, mobilityScore: 187, countryName: 'Australia' },

    // Africa
    { countryCode: 'ZA', rank: 51, mobilityScore: 106, countryName: 'South Africa' },
    { countryCode: 'MA', rank: 73, mobilityScore: 67, countryName: 'Morocco' },
    { countryCode: 'TN', rank: 70, mobilityScore: 71, countryName: 'Tunisia' },
    { countryCode: 'GH', rank: 76, mobilityScore: 64, countryName: 'Ghana' },
    { countryCode: 'KE', rank: 67, mobilityScore: 76, countryName: 'Kenya' },
    { countryCode: 'EG', rank: 83, mobilityScore: 53, countryName: 'Egypt' },
    { countryCode: 'ET', rank: 88, mobilityScore: 46, countryName: 'Ethiopia' },
    { countryCode: 'NG', rank: 91, mobilityScore: 45, countryName: 'Nigeria' },
];

export const getPassportRanking = async (): Promise<PassportRanking[]> => {
    try {
        // Try to fetch from Travel Buddy API
        if (TRAVEL_BUDDY_API_KEY && TRAVEL_BUDDY_API_KEY !== 'your_travel_buddy_key') {
            // Check if it's a RapidAPI key
            const isRapidApi = TRAVEL_BUDDY_API_KEY.startsWith('ca') || TRAVEL_BUDDY_API_KEY.includes('msh');

            const baseUrl = isRapidApi
                ? 'https://visa-requirement.p.rapidapi.com'
                : TRAVEL_BUDDY_BASE_URL;

            const headers: any = {
                'X-API-Key': TRAVEL_BUDDY_API_KEY,
            };

            if (isRapidApi) {
                headers['X-RapidAPI-Key'] = TRAVEL_BUDDY_API_KEY;
                headers['X-RapidAPI-Host'] = 'visa-requirement.p.rapidapi.com';
                // Remove X-API-Key if using RapidAPI headers to avoid confusion, or keep both if unsure
                delete headers['X-API-Key'];
            }

            const response = await axios.post(`${baseUrl}/v2/passport/rank/custom`, {
                weights: {
                    "Visa-free": 1,
                    "Visa on arrival": 0.7,
                    "Visa required": 0,
                    "eVisa": 0.5,
                    "eTA": 0.5,
                    "Tourist card": 0,
                    "Freedom of movement": 1,
                    "Not admitted": 0
                }
            }, {
                headers
            });

            // Transform API response to our format
            // API returns { data: [ { rank, score, passport: { code, name }, ... } ], meta: ... }
            const rankings = response.data.data.map((item: any) => ({
                countryCode: item.passport.code,
                rank: item.rank,
                mobilityScore: Math.round(item.score), // Round score to integer
                countryName: item.passport.name,
            }));

            console.log('Fetched passport rankings from Travel Buddy API:', rankings.length);
            return rankings;
        }
    } catch (error) {
        console.error('Failed to fetch from Travel Buddy API, using mock data:', error);
    }

    // Return mock data if API fails or no API key
    console.log('Using mock passport data');
    return MOCK_PASSPORTS.sort((a, b) => a.rank - b.rank);
};

export const getPassportByCode = async (code: string): Promise<PassportRanking | undefined> => {
    const rankings = await getPassportRanking();
    return rankings.find(p => p.countryCode.toUpperCase() === code.toUpperCase());
};

export const checkVisaRequirements = async (passportCode: string, destinationCode: string) => {
    try {
        if (TRAVEL_BUDDY_API_KEY && TRAVEL_BUDDY_API_KEY !== 'your_travel_buddy_key') {
            // Check if it's a RapidAPI key
            const isRapidApi = TRAVEL_BUDDY_API_KEY.startsWith('ca') || TRAVEL_BUDDY_API_KEY.includes('msh');

            const baseUrl = isRapidApi
                ? 'https://visa-requirement.p.rapidapi.com'
                : TRAVEL_BUDDY_BASE_URL;

            const headers: any = {
                'X-API-Key': TRAVEL_BUDDY_API_KEY,
            };

            if (isRapidApi) {
                headers['X-RapidAPI-Key'] = TRAVEL_BUDDY_API_KEY;
                headers['X-RapidAPI-Host'] = 'visa-requirement.p.rapidapi.com';
                delete headers['X-API-Key'];
            }

            const response = await axios.post(`${baseUrl}/v2/visa/check`, {
                passport: passportCode,
                destination: destinationCode
            }, { headers });

            return response.data.data;
        }
    } catch (error) {
        console.error('Failed to check visa requirements:', error);
        return null;
    }
    return null;
};

export const getCountryCode = (countryName: string): string | undefined => {
    const passport = MOCK_PASSPORTS.find(p =>
        p.countryName?.toLowerCase() === countryName.toLowerCase() ||
        p.countryCode.toLowerCase() === countryName.toLowerCase()
    );
    return passport?.countryCode;
};
