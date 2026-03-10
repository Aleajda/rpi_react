import express from 'express';
import { getAllOffers, createOffer, getFullOffer, getFavoriteOffers, toggleFavorite } from '../controllers/offerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/favorite', authenticateToken, getFavoriteOffers);
router.post('/favorite/:offerId/:status', authenticateToken, toggleFavorite);
router.get('/:id', getFullOffer);
// создание оффера: все изображения приходят в body как base64 (previewImageBase64, photosBase64[])
router.post('/', authenticateToken, createOffer);

export default router;
