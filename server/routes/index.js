import express from 'express';
import offerRoutes from './offerRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/offers', offerRoutes);
router.use('/users', userRoutes);

export default router;
