import express from 'express';
import offerRoutes from './offerRoutes.js';

const router = express.Router();

router.use('/offers', offerRoutes);

export default router;
