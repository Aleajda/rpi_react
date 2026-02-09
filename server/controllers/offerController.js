import { Offer } from '../models/offer.js';

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
