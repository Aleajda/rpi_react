import express from 'express';
import { registration, login, checkAuth, logout } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// регистрация теперь принимает avatar как base64 в body
router.post('/registration', registration);
router.post('/login', login);
router.get('/login', authenticateToken, checkAuth);
router.delete('/logout', logout);

export default router;