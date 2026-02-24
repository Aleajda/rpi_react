import ApiError from '../error/ApiError.js';
import { Review } from '../models/review.js';
import { Offer } from '../models/offer.js';
import { User } from '../models/user.js';
import { adaptReviewToClient } from '../adapters/reviewAdapter.js';

export const addReview = async (req, res, next) => {
  try {
    const { offerId } = req.params;
    const { comment, rating } = req.body;

    if (!comment || rating === undefined || rating === null) {
      return next(ApiError.badRequest('Некорректные данные отзыва'));
    }

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    const normalizedRating = Number.parseInt(rating, 10);
    if (Number.isNaN(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return next(ApiError.badRequest('Некорректный рейтинг'));
    }

    const review = await Review.create({
      text: comment,
      rating: normalizedRating,
      authorId: req.user.id,
      OfferId: offer.id
    });

    await Offer.update(
      { commentsCount: (offer.commentsCount || 0) + 1 },
      { where: { id: offer.id } }
    );

    const created = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'userType'] }]
    });

    return res.status(201).json(adaptReviewToClient(created));
  } catch (error) {
    next(ApiError.internal('Ошибка добавления отзыва'));
  }
};

export const getReviewsByOfferId = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findByPk(offerId);
    if (!offer) {
      return next(ApiError.badRequest('Offer not found'));
    }

    const reviews = await Review.findAll({
      where: { OfferId: offerId },
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'userType'] }],
      order: [['publishDate', 'DESC']]
    });

    return res.json(reviews.map(adaptReviewToClient));
  } catch (error) {
    next(ApiError.internal('Ошибка получения списка отзывов'));
  }
};

