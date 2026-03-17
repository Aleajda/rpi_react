import express from 'express';
import { registration, login, checkAuth, logout } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// регистрация: поддержка multipart/form-data (avatar как файл) + совместимость с avatarBase64
router.post('/registration', upload.single('avatar'), registration);
router.post('/login', login);
router.get('/login', authenticateToken, checkAuth);
router.delete('/logout', logout);

export default router;