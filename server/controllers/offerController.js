import { Offer } from '../models/offer.js';
import ApiError from '../error/ApiError.js';
import { adaptOfferToClient, adaptFullOfferToClient } from '../adapters/offerAdapter.js';
import { User } from '../models/user.js';
import fs from 'fs';
import path from 'path';

export async function createOffer(req, res, next) {
  try {
    const {
      title, description, publishDate, city,
      isPremium, isFavorite, rating, type, rooms, guests, price,
      features, commentsCount, latitude, longitude, userId,
      previewImageBase64, photosBase64
    } = req.body;

    // базовая нормализация и валидация входных данных до сохранения,
    // чтобы возвращать корректный 400, а не 500 от БД
    const normalizedTitle = String(title ?? '').trim();
    const normalizedDescription = String(description ?? '').trim();

    if (normalizedTitle.length < 10 || normalizedTitle.length > 100) {
      return next(ApiError.badRequest('Поле title должно быть длиной 10-100 символов'));
    }
    if (normalizedDescription.length < 20 || normalizedDescription.length > 1024) {
      return next(ApiError.badRequest('Поле description должно быть длиной 20-1024 символов'));
    }

    if (!city) {
      return next(ApiError.badRequest('Поле city обязательно'));
    }
    if (!type) {
      return next(ApiError.badRequest('Поле type обязательно'));
    }

    const roomsNum = rooms === undefined || rooms === null || rooms === '' ? NaN : Number(rooms);
    const guestsNum = guests === undefined || guests === null || guests === '' ? NaN : Number(guests);
    const priceNum = price === undefined || price === null || price === '' ? NaN : Number(price);
    const latNum = latitude === undefined || latitude === null || latitude === '' ? NaN : Number(latitude);
    const lngNum = longitude === undefined || longitude === null || longitude === '' ? NaN : Number(longitude);

    if (!Number.isFinite(roomsNum)) {
      return next(ApiError.badRequest('Поле rooms обязательно и должно быть числом'));
    }
    if (!Number.isFinite(guestsNum)) {
      return next(ApiError.badRequest('Поле guests обязательно и должно быть числом'));
    }
    if (!Number.isFinite(priceNum)) {
      return next(ApiError.badRequest('Поле price обязательно и должно быть числом'));
    }
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      return next(ApiError.badRequest('Поля latitude и longitude обязательны и должны быть числами'));
    }

    // rating: по умолчанию 1.0, если не пришло
    let ratingNum = rating === undefined || rating === null || rating === '' ? 1 : Number(rating);
    if (!Number.isFinite(ratingNum)) {
      return next(ApiError.badRequest('Поле rating должно быть числом от 1 до 5'));
    }
    if (ratingNum < 1 || ratingNum > 5) {
      return next(ApiError.badRequest('Поле rating должно быть в диапазоне 1..5'));
    }

    // убеждаемся, что папка static есть
    if (!fs.existsSync('static')) {
      fs.mkdirSync('static');
    }

    // multipart/form-data: previewImage как файл (preferred)
    // fallback: previewImageBase64 как раньше
    let previewImagePath = null;
    const previewFromUpload = req.files?.previewImage?.[0];

    if (previewFromUpload?.filename) {
      previewImagePath = `/static/${previewFromUpload.filename}`;
    } else if (previewImageBase64) {
      const previewBuffer = Buffer.from(
        String(previewImageBase64).replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );
      const previewFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;
      const previewPath = path.join('static', previewFilename);
      fs.writeFileSync(previewPath, previewBuffer);
      previewImagePath = `/static/${previewFilename}`;
    }

    if (!previewImagePath) {
      return next(ApiError.badRequest('Превью изображение обязательно (previewImage)'));
    }

    // фотографии: multipart files (preferred) или base64[] (fallback)
    let processedPhotos = [];

    const photosFromUpload = req.files?.photos;
    if (Array.isArray(photosFromUpload) && photosFromUpload.length > 0) {
      processedPhotos = photosFromUpload
        .filter((f) => f?.filename)
        .map((f) => `/static/${f.filename}`);
    } else if (Array.isArray(photosBase64)) {
      processedPhotos = photosBase64.map((photoBase64) => {
        const photoBuffer = Buffer.from(
          String(photoBase64).replace(/^data:image\/\w+;base64,/, ''),
          'base64'
        );
        const photoFilename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.png`;
        const photoPath = path.join('static', photoFilename);
        fs.writeFileSync(photoPath, photoBuffer);
        return `/static/${photoFilename}`;
      });
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = String(features).split(',');
      }
    }

    // Нормализация и валидация features: только допустимые значения enum из модели
    const allowedFeatures = [
      'Breakfast',
      'Air conditioning',
      'Laptop friendly workspace',
      'Baby seat',
      'Washer',
      'Towels',
      'Fridge'
    ];
    const lowerToCanonical = allowedFeatures.reduce((acc, item) => {
      acc[item.toLowerCase()] = item;
      return acc;
    }, {});

    const normalizedFeatures = Array.isArray(parsedFeatures)
      ? parsedFeatures
          .map((f) => String(f).trim())
          .filter((f) => f.length > 0)
          .map((f) => lowerToCanonical[f.toLowerCase()] ?? f)
      : [];

    const invalidFeature = normalizedFeatures.find(
      (f) => !allowedFeatures.includes(f)
    );
    if (invalidFeature) {
      return next(
        ApiError.badRequest(
          `Недопустимое значение для features: "${invalidFeature}". Разрешены: ${allowedFeatures.join(', ')}`
        )
      );
    }

    const offer = await Offer.create({
      title: normalizedTitle,
      description: normalizedDescription,
      publishDate,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium: isPremium === true || isPremium === 'true' || isPremium === '1' || isPremium === 1,
      isFavorite: isFavorite === true || isFavorite === 'true' || isFavorite === '1' || isFavorite === 1,
      rating: ratingNum,
      type,
      rooms: roomsNum,
      guests: guestsNum,
      price: priceNum,
      features: normalizedFeatures,
      commentsCount: commentsCount === undefined || commentsCount === null || commentsCount === '' ? 0 : Number(commentsCount),
      latitude: latNum,
      longitude: lngNum,
      authorId: userId ?? req.user?.id
    });

    return res.status(201).json(adaptFullOfferToClient(offer, null));
  } catch (error) {
    next(ApiError.internal('Не удалось добавить предложение: ' + error.message));
  }
}

export const getAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll();
    const adaptedOffers = offers.map((offer) => adaptOfferToClient(offer));
    res.json(adaptedOffers);
  } catch (error) {
    next(ApiError.internal('Ошибка получения списка предложений'));
  }
};

export const getFullOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await Offer.findByPk(id, {
      include: [{ model: User, as: 'author' }]
    });

    if (!offer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    const fullOffer = adaptFullOfferToClient(offer, offer.author);

    return res.send(fullOffer);
  } catch (error) {
    next(ApiError.internal('Не удалось получить предложение: ' + error.message));
  }
};

export const getFavoriteOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({ where: { isFavorite: true } });
    return res.json(offers.map(adaptOfferToClient));
  } catch (error) {
    next(ApiError.internal('Ошибка получения списка избранных предложений'));
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { offerId, status } = req.params;

    const isFavorite = status === '1' || status === 'true';

    const offer = await Offer.findByPk(offerId, {
      include: [{ model: User, as: 'author' }]
    });

    if (!offer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    offer.isFavorite = isFavorite;
    await offer.save();

    return res.json(adaptFullOfferToClient(offer, offer.author));
  } catch (error) {
    next(ApiError.internal('Ошибка обновления избранного'));
  }
};
