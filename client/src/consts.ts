export const Settings = {
  rentOffersCount: 312
} as const;

export const AppRoute = {
  Main: '/',
  Login: '/login',
  Favorites: '/favorites',
  Offer: '/offer',
  NotFound: '*'
} as const;

export const APIRoute = {
  Offers: '/offers',
  Login: '/users/login',
  Logout: '/users/logout'
} as const;

export const AuthorizationStatus = {
  Auth: 'AUTH',
  NoAuth: 'NO_AUTH',
  Unknown: 'UNKNOWN'
} as const;
