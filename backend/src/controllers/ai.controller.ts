import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';

export const planTrip = async (req: Request, res: Response) => {
  try {
    const plan = await aiService.generateTripPlan(req.body);
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate trip plan' });
  }
};

export const optimizeRoute = async (req: Request, res: Response) => {
  try {
    const { destinations } = req.body;
    const route = await aiService.optimizeRoute(destinations);
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize route' });
  }
};

export const getHotels = async (req: Request, res: Response) => {
  try {
    const { country } = req.query;
    if (!country || typeof country !== 'string') {
      return res.status(400).json({ error: 'Country parameter is required' });
    }
    const hotels = await aiService.getTopHotels(country);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get hotels' });
  }
};
