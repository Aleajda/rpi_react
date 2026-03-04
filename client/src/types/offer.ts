export type CityLocation = {
  latitude: number;
  longitude: number;
  zoom: number;
};

export type City = {
  name: string;
  location: CityLocation;
};

export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  rooms: number;
  guests: number;
  city: City;
  location: {
    latitude: number;
    longitude: number;
  };
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
};

export type FullOffer = Offer & {
  description: string;
  photos: string[];
  features: string[];
  commentsCount: number;
  host: {
    id: string;
    name: string;
    isPro: boolean;
    avatarUrl: string;
  } | null;
};

export type OffersList = Offer[];

