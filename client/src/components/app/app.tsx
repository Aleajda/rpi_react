import type { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../../pages/main-page/main-page';
import LoginPage from '../../pages/login-page/login-page';
import FavoritesPage from '../../pages/favorites-page/favorites-page';
import OfferPage from '../../pages/offer-page/offer-page';
import PageNotFound from '../../pages/page-not-found/page-not-found';
import { AppRoute } from '../../consts';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path={AppRoute.Main} element={<MainPage />} />
      <Route path={AppRoute.Login} element={<LoginPage />} />
      <Route path={AppRoute.Favorites} element={<FavoritesPage />} />
      <Route path="/offer/:id" element={<OfferPage />} />
      <Route path={AppRoute.NotFound} element={<PageNotFound />} />
    </Routes>
  );
}
