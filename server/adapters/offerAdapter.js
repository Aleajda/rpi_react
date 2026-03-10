const cityCoordinates = {
  Paris: { latitude: 48.8566, longitude: 2.3522, zoom: 13 },
  Cologne: { latitude: 50.9375, longitude: 6.9603, zoom: 13 },
  Brussels: { latitude: 50.8503, longitude: 4.3517, zoom: 13 },
  Amsterdam: { latitude: 52.3676, longitude: 4.9041, zoom: 13 },
  Hamburg: { latitude: 53.5511, longitude: 9.9937, zoom: 13 },
  Dusseldorf: { latitude: 51.2277, longitude: 6.7735, zoom: 13 }
};

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

// краткая карточка предложения для списка
const adaptOfferToClient = (offer) => {
  const cityLocation = cityCoordinates[offer.city];

  return {
    id: String(offer.id),
    title: offer.title,
    type: offer.type,
    price: offer.price,
    city: {
      name: offer.city,
      location: cityLocation
    },
    location: offer.latitude && offer.longitude ? {
      latitude: offer.latitude,
      longitude: offer.longitude,
      zoom: cityLocation?.zoom ?? 13
    } : { latitude: 0, longitude: 0, zoom: cityLocation?.zoom ?? 13 },
    isFavorite: offer.isFavorite,
    favorite: offer.isFavorite,
    isPremium: offer.isPremium,
    premium: offer.isPremium,
    rating: typeof offer.rating === 'number' ? offer.rating : parseFloat(offer.rating),
    previewImage: withBaseUrl(offer.previewImage)
  };
};

// полная карточка предложения для страницы оффера
const adaptFullOfferToClient = (offer, author) => {
  const cityLocation = cityCoordinates[offer.city];

  const photos = (offer.photos || []).map((photo) => withBaseUrl(photo));

  return {
    id: String(offer.id),
    title: offer.title,
    description: offer.description,
    type: offer.type,
    price: offer.price,
    city: {
      name: offer.city,
      location: cityLocation
    },
    location: offer.latitude && offer.longitude ? {
      latitude: offer.latitude,
      longitude: offer.longitude,
      zoom: cityLocation?.zoom ?? 13
    } : { latitude: 0, longitude: 0, zoom: cityLocation?.zoom ?? 13 },
    isFavorite: offer.isFavorite,
    favorite: offer.isFavorite,
    isPremium: offer.isPremium,
    premium: offer.isPremium,
    rating: typeof offer.rating === 'number' ? offer.rating : parseFloat(offer.rating),
    previewImage: withBaseUrl(offer.previewImage),
    images: photos,
    rooms: offer.rooms,
    guests: offer.guests,
    features: offer.features,
    commentsCount: offer.commentsCount,
    author: author ? {
      username: author.username,
      avatarUrl: withBaseUrl(author.avatar),
      pro: author.userType === 'pro'
    } : null
  };
};

export { adaptOfferToClient, adaptFullOfferToClient };

