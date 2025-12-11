import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppRoute, AuthorizationStatus } from "../../const";
import { PrivateRoute } from "../private-route/private-route";
import { FullOffer, OffersList } from "../../types/offer";
import { Review } from "../../types/reviews";
import LoginPage from "../../pages/login-page/login-page";
import OfferPage from "../../pages/offer-page/offer-page";
import FavoritesPage from "../../pages/favorites-page/favorites-page";
import PageNotFound from "../../pages/page-not-found/page-not-found";
import MainPage from "../../pages/main-page/main-page";


type AppMainPageProps = {
    rentalOffersCount: number;
    offers: FullOffer[];
    offersList: OffersList[];
    reviews: Review[];
}

function App({ offers, offersList, reviews }: AppMainPageProps): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoute.Main}
                    element={<MainPage />}
                />
                <Route
                    path={AppRoute.Login}
                    element={<LoginPage />}
                />
                <Route
                    path={`${AppRoute.Offer}/:id`}
                    element={<OfferPage offers={offers} reviews={reviews} />}
                />
                <Route
                    path={AppRoute.Favorites}
                    element={
                        <PrivateRoute
                            authorizationStatus={AuthorizationStatus.Auth}
                        >
                            <FavoritesPage offersList={offersList} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="*"
                    element={<PageNotFound />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App;