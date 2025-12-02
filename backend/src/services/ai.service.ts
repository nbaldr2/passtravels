import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { checkVisaRequirements } from './passport.service';
import { getCountryByCode, getCountryByName, getVisaRule } from './country.service';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

type TripRequest = { from: string; to: string; budget: number; days?: number };

const resolveCountry = async (input: string): Promise<{ code?: string; name?: string }> => {
  if (!input) return {};
  const trimmed = input.trim();
  const maybeCode = /^[A-Za-z]{2}$/.test(trimmed) ? trimmed.toUpperCase() : undefined;
  try {
    if (maybeCode) {
      const byCode = await getCountryByCode(maybeCode);
      return byCode ? { code: byCode.code, name: byCode.name } : { code: maybeCode };
    }
    const byName = await getCountryByName(trimmed);
    return byName ? { code: byName.code, name: byName.name } : { name: trimmed };
  } catch (e) {
    console.warn('Failed to resolve country', { input, error: e });
    return { name: trimmed };
  }
};

const visaRuleToBool = (type?: string): boolean | undefined => {
  if (!type) return undefined;
  const t = type.toLowerCase();
  if (t.includes('free')) return false;
  if (t.includes('ban')) return true;
  if (t.includes('required')) return true;
  if (t.includes('evisa')) return true;
  if (t.includes('voa')) return true; // visa-on-arrival still implies visa
  return undefined;
};

export const generateTripPlan = async (data: TripRequest) => {
  const tripDays = data.days || 5; // Default to 5 days if not specified

  // Resolve countries from input (accepts ISO codes or names)
  const [fromInfo, toInfo] = await Promise.all([
    resolveCountry(data.from),
    resolveCountry(data.to)
  ]);

  const fromCode = fromInfo.code;
  const toCode = toInfo.code;
  const fromName = fromInfo.name || data.from;
  const toName = toInfo.name || data.to;

  // Check visa requirements via external API, then fallback to DB visa rules
  let realVisaInfo: any = null;
  if (fromCode && toCode) {
    console.log(`Checking visa requirements for ${fromCode} -> ${toCode}`);
    try {
      realVisaInfo = await checkVisaRequirements(fromCode, toCode);
    } catch (e) {
      console.warn('External visa check failed, will attempt DB fallback', e);
    }
    if (!realVisaInfo) {
      const rule = await getVisaRule(fromCode, toCode);
      if (rule && rule.type && rule.type !== 'unknown') {
        realVisaInfo = {
          type: rule.type,
          duration: rule.duration,
          notes: rule.notes
        };
      }
    }
  }

  if (!genAI) {
    console.warn('GEMINI_API_KEY is not set. Using mock data.');
    return getMockTripPlan({ from: fromName, to: toName, budget: data.budget, days: tripDays }, realVisaInfo);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are an expert travel guide AI. Create a detailed, realistic travel itinerary from ${fromName} to ${toName}
      with a budget of ${data.budget} USD for ${tripDays} days.

      Context:
      Real Visa Information: ${realVisaInfo ? JSON.stringify(realVisaInfo) : 'Not available (provide general advice)'}

      Requirements:
      - Use REAL place names (hotels, restaurants, attractions, landmarks)
      - Include hotel recommendations with approximate costs
      - Name actual tourist attractions and activities in ${toName}
      - Include real restaurants and cuisine experiences
      - Provide accurate visa information based on the real visa info above
      - Distribute the budget realistically across all ${tripDays} days
      - Include transportation costs (flights, local transport)

      Output:
      Return ONLY a strict JSON object with these keys and types (no markdown, no comments):
      - from: string
      - destination: string
      - totalCost: number
      - currency: "USD"
      - days: number
      - visaRequired: boolean
      - visaWarning: string
      - hotels: array of { name: string, category: string, pricePerNight: number, location: string }
      - itinerary: array of { day: number, title: string, activities: array of { time: string, activity: string, location: string, cost: number, duration: string }, meals: array of { type: string, restaurant: string, cost: number }, totalDayCost: number }
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      generationConfig: { responseMimeType: 'application/json' }
    });
    const response = await result.response;
    const text = response.text();

    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    // Remove trailing commas before closing braces/brackets to harden against minor formatting
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Gemini returned non-JSON. Raw:', text);
      throw parseErr;
    }

    // Overlay visa info if the model omitted it
    if (realVisaInfo) {
      const required = visaRuleToBool(realVisaInfo.type);
      if (typeof parsed.visaRequired === 'undefined' && typeof required !== 'undefined') {
        parsed.visaRequired = required;
      }
      if (!parsed.visaWarning) {
        const notes = realVisaInfo.notes ? `Notes: ${realVisaInfo.notes}` : '';
        const duration = realVisaInfo.duration ? `Duration: up to ${realVisaInfo.duration} days.` : '';
        parsed.visaWarning = `Visa type: ${realVisaInfo.type || 'unknown'}. ${duration} ${notes}`.trim();
      }
    }

    return parsed;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return getMockTripPlan({ from: fromName, to: toName, budget: data.budget, days: tripDays }, realVisaInfo);
  }
};

export const optimizeRoute = async (destinations: string[]) => {
  // Placeholder for route optimization if needed later
  return {
    optimizedOrder: destinations.sort(),
    totalDistance: '12000 km',
    estimatedCost: 3000,
  };
};

const getMockTripPlan = (data: { from: string; to: string; budget: number; days: number }, visaInfo?: any) => {
  const costPerDay = Math.floor(data.budget / data.days);
  const required = visaRuleToBool(visaInfo?.type);

  return {
    from: data.from,
    destination: data.to,
    totalCost: data.budget,
    currency: 'USD',
    days: data.days,
    visaRequired: typeof required === 'undefined' ? true : required,
    visaWarning: visaInfo
      ? `Visa type: ${visaInfo.type || 'unknown'}. ${visaInfo.duration ? `Duration: up to ${visaInfo.duration} days.` : ''} ${visaInfo.notes ? `Notes: ${visaInfo.notes}` : ''}`.trim()
      : 'Mock Data: Please check visa requirements with the embassy.',
    hotels: [
      {
        name: `${data.to} Plaza Hotel`,
        category: 'Mid-range',
        pricePerNight: Math.round(costPerDay * 0.35),
        location: 'City Center'
      }
    ],
    itinerary: Array.from({ length: data.days }, (_, i) => ({
      day: i + 1,
      title: i === 0 ? `Arrival in ${data.to}` : i === data.days - 1 ? 'Departure Day' : `Exploring ${data.to}`,
      activities: [
        {
          time: '9:00 AM',
          activity: i === 0 ? 'Hotel check-in and orientation' : 'Visit local attractions',
          location: i === 0 ? `${data.to} Plaza Hotel` : `${data.to} City Center`,
          cost: Math.round(costPerDay * 0.3),
          duration: '3 hours'
        },
        {
          time: '2:00 PM',
          activity: i === data.days - 1 ? 'Departure preparation' : 'Cultural experience',
          location: 'Various locations',
          cost: Math.round(costPerDay * 0.2),
          duration: '4 hours'
        }
      ],
      meals: [
        {
          type: 'Breakfast',
          restaurant: 'Hotel Restaurant',
          cost: Math.round(costPerDay * 0.1)
        },
        {
          type: 'Lunch',
          restaurant: 'Local Cuisine Restaurant',
          cost: Math.round(costPerDay * 0.15)
        },
        {
          type: 'Dinner',
          restaurant: 'Traditional Restaurant',
          cost: Math.round(costPerDay * 0.2)
        }
      ],
      totalDayCost: costPerDay
    }))
  };
};

export const getTopHotels = async (country: string) => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not set. Using mock data.');
    return getMockHotels(country);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      You are a luxury travel expert. Provide the top 5 hotels in ${country}.
      
      IMPORTANT REQUIREMENTS:
      1. Use REAL hotel names (actual hotels that exist)
      2. Include accurate star ratings (1-5 stars)
      3. Provide realistic price ranges per night in USD
      4. List real amenities and features
      5. Include specific location/area within the country
      6. Add a brief description highlighting what makes each hotel special
      
      Return ONLY a valid JSON object (no markdown, no code blocks, no explanations):
      {
        "country": "${country}",
        "hotels": [
          {
            "name": "[Real hotel name]",
            "rating": [number 1-5],
            "pricePerNight": [number in USD],
            "category": "[Budget/Mid-range/Luxury/Ultra-Luxury]",
            "location": "[Specific area/city in ${country}]",
            "description": "[Brief description 1-2 sentences]",
            "amenities": ["amenity1", "amenity2", "amenity3"],
            "image": "[brief description for image placeholder]"
          }
        ]
      }
      
      Make sure all hotels are real, well-known establishments in ${country}.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Remove any text before the first { and after the last }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error calling Gemini API for hotels:', error);
    return getMockHotels(country);
  }
};

const getMockHotels = (country: string) => {
  return {
    country,
    hotels: [
      {
        name: `Grand ${country} Hotel`,
        rating: 5,
        pricePerNight: 250,
        category: 'Luxury',
        location: 'City Center',
        description: 'A luxurious 5-star hotel in the heart of the city with world-class amenities.',
        amenities: ['Pool', 'Spa', 'Restaurant', 'Gym', 'WiFi'],
        image: 'luxury hotel exterior'
      },
      {
        name: `${country} Palace Resort`,
        rating: 4.5,
        pricePerNight: 180,
        category: 'Mid-range',
        location: 'Beach Area',
        description: 'Beautiful beachfront resort with stunning views and excellent service.',
        amenities: ['Beach Access', 'Pool', 'Restaurant', 'WiFi'],
        image: 'beach resort'
      },
      {
        name: `Central ${country} Inn`,
        rating: 4,
        pricePerNight: 120,
        category: 'Mid-range',
        location: 'Downtown',
        description: 'Comfortable hotel with modern rooms and convenient location.',
        amenities: ['WiFi', 'Breakfast', 'Parking'],
        image: 'modern hotel lobby'
      },
      {
        name: `${country} Boutique Hotel`,
        rating: 4.5,
        pricePerNight: 150,
        category: 'Mid-range',
        location: 'Historic District',
        description: 'Charming boutique hotel with unique character and personalized service.',
        amenities: ['WiFi', 'Restaurant', 'Rooftop Bar'],
        image: 'boutique hotel entrance'
      },
      {
        name: `Budget Stay ${country}`,
        rating: 3.5,
        pricePerNight: 60,
        category: 'Budget',
        location: 'Suburbs',
        description: 'Clean and affordable accommodation perfect for budget travelers.',
        amenities: ['WiFi', 'Breakfast', 'Parking'],
        image: 'budget hotel room'
      }
    ]
  };
};

