import express from 'express';
import offerRoutes from './offerRoutes.js';
import userRoutes from './userRoutes.js';
import reviewRoutes from './reviewRoutes.js';

const router = express.Router();

router.use('/offers', offerRoutes);
router.use('/users', userRoutes);
router.use('/comments', reviewRoutes);

export default router;
