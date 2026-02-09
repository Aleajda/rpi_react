import express from 'express';
import { getAllOffers } from '../controllers/offerController.js';

const router = express.Router();

router.get('/', getAllOffers);

export default router;
