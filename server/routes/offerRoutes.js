import express from 'express';
import { getAllOffers, createOffer, getFullOffer, getFavoriteOffers, toggleFavorite } from '../controllers/offerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getAllOffers);
router.get('/favorite', authenticateToken, getFavoriteOffers);
router.post('/favorite/:offerId/:status', authenticateToken, toggleFavorite);
router.get('/:id', getFullOffer);
// создание оффера: поддержка multipart/form-data
// - previewImage: файл
// - photos: файлы (multi)
// поля приходят как text parts
router.post(
  '/',
  authenticateToken,
  upload.fields([{ name: 'previewImage', maxCount: 1 }, { name: 'photos', maxCount: 10 }]),
  createOffer
);

export default router;
