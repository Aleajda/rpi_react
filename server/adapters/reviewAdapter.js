const getBaseUrl = () => {
  const host = process.env.HOST || 'http://localhost';
  const port = process.env.PORT || 5000;
  return `${host}:${port}`;
};

const withBaseUrl = (path) => {
  const baseUrl = getBaseUrl();
  if (!path) {
    return '';
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};

// формат под маппинг клиента в fetchReviewsAction / sendReviewAction
const adaptReviewToClient = (review) => {
  const dateIso = review.publishDate instanceof Date
    ? review.publishDate.toISOString()
    : new Date(review.publishDate).toISOString();

  return {
    reviewId: String(review.id),
    comment: review.text,
    rating: typeof review.rating === 'number' ? review.rating : parseFloat(review.rating),
    date: dateIso,
    user: {
      username: review.author?.username || 'Unknown',
      avatarUrl: withBaseUrl(review.author?.avatar || ''),
      pro: review.author?.userType === 'pro'
    }
  };
};

export { adaptReviewToClient };

