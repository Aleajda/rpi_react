import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import { User } from '../models/user.js';
import fs from 'fs';
import path from 'path';
export const registration = async (req, res, next) => {
  try {
    const { email, password, username, userType, avatarBase64 } = req.body;
    if (!email || !password || !username) {
      return next(ApiError.badRequest('Email, password и username обязательны'));
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь уже существует'));
    }

    let avatarImage = null;

    // multipart/form-data: avatar как файл
    if (req.file?.filename) {
      avatarImage = `/static/${req.file.filename}`;
    } else if (avatarBase64) {
      // совместимость: avatar как base64 в JSON/form
      const base64Data = String(avatarBase64).replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      if (!fs.existsSync('static')) {
        fs.mkdirSync('static', { recursive: true });
      }

      const filename = Date.now() + '.png';
      const filepath = path.resolve('static', filename);

      fs.writeFileSync(filepath, buffer);

      avatarImage = `/static/${filename}`;
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      password: hashPassword,
      username,
      userType: userType || 'normal',
      avatar: avatarImage
    });

    return res.status(201).json({
      id: String(user.id),
      name: user.username,
      avatar: user.avatar,
      isPro: user.userType === 'pro',
      email: user.email
    });

  } catch (error) {
    console.error(error);
    next(ApiError.internal('Ошибка регистрации'));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiError.badRequest('Некорректный email или password'));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return next(ApiError.badRequest('Пользователь не найден'));

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return next(ApiError.badRequest('Неверный пароль'));

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    // клиент ожидает поле accessToken
    return res.json({
      id: String(user.id),
      name: user.username,
      avatar: user.avatar,
      isPro: user.userType === 'pro',
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    next(ApiError.internal('Ошибка авторизации'));
  }
};

export const checkAuth = (req, res, next) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        userType: user.userType,
        avatar: user.avatar
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // формат UserData для клиента
    return res.json({
      id: String(user.id),
      name: user.username,
      avatar: user.avatar,
      isPro: user.userType === 'pro',
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    next(ApiError.internal('Ошибка проверки авторизации'));
  }
};

export const logout = (req, res) => res.status(204).send();
