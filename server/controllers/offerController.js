import { Offer } from '../models/offer.js';
import ApiError from '../error/ApiError.js';
import { adaptOfferToClient, adaptFullOfferToClient } from '../adapters/offerAdapter.js';
import { User } from '../models/user.js';

export async function createOffer(req, res, next) {
  try {
    const {
      title, description, publishDate, city,
      isPremium, isFavorite, rating, type, rooms, guests, price,
      features, commentsCount, latitude, longitude, userId
    } = req.body;

    if (!req.files?.previewImage || req.files.previewImage.length === 0) {
      return next(ApiError.badRequest('Превью изображение обязательно для загрузки'));
    }

    const previewImagePath = `/static/${req.files.previewImage[0].filename}`;

    let processedPhotos = [];
    if (req.files?.photos) {
      processedPhotos = req.files.photos.map(file => `/static/${file.filename}`);
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = features.split(',');
      }
    }

    const offer = await Offer.create({
      title,
      description,
      publishDate,
      city,
      previewImage: previewImagePath,
      photos: processedPhotos,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      features: parsedFeatures,
      commentsCount,
      latitude,
      longitude,
      authorId: userId
    });

    return res.status(201).json(offer);
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
      include: { model: (await import('../models/user.js')).User, as: 'author' }
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
