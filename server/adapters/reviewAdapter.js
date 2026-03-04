const getBaseUrl = () => {
  const host = process.env.HOST || 'http://localhost';
  const port = process.env.PORT || 5000;
  return `${host}:${port}`;
};

const adaptReviewToClient = (review) => {
  const baseUrl = getBaseUrl();

  const prepareUrl = (url) =>
    url && !url.startsWith('http')
      ? `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
      : url;

  return {
    id: String(review.id),
    comment: review.text,
    rating: parseFloat(review.rating),
    date: review.publishDate instanceof Date
      ? review.publishDate.toISOString()
      : new Date(review.publishDate).toISOString(),
    user: {
      name: review.author?.username || 'Unknown',
      avatarUrl: prepareUrl(review.author?.avatar || ''),
      isPro: review.author?.userType === 'pro'
    }
  };
};

export { adaptReviewToClient };

