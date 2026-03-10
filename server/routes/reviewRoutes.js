import express from 'express';
import { addReview, getReviewsByOfferId } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:offerId', getReviewsByOfferId);
router.post('/:offerId', authenticateToken, addReview);
// под клиентский POST /comments
router.post('/', authenticateToken, addReview);

export default router;

