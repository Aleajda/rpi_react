import express from 'express';
import upload from '../middleware/upload.js';
import { getAllOffers, createOffer, getFullOffer, getFavoriteOffers, toggleFavorite } from '../controllers/offerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/favorite', authenticateToken, getFavoriteOffers);
router.post('/favorite/:offerId/:status', authenticateToken, toggleFavorite);
router.get('/:id', getFullOffer);
router.post(
  '/',
  upload.fields([
    { name: 'previewImage', maxCount: 1 },
    { name: 'photos', maxCount: 6 }
  ]),
  createOffer
);

export default router;
