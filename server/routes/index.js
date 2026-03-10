import express from 'express';
import offerRoutes from './offerRoutes.js';
import userRoutes from './userRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getFavoriteOffers, toggleFavorite } from '../controllers/offerController.js';

const router = express.Router();

// предложения
router.use('/offers', offerRoutes);

// аутентификация /login и /logout
router.use('/', userRoutes);

// отзывы /comments
router.use('/comments', reviewRoutes);

// избранное /favorite
router.get('/favorite', authenticateToken, getFavoriteOffers);
router.post('/favorite/:offerId/:status', authenticateToken, toggleFavorite);

export default router;
