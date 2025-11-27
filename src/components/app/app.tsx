import { JSX } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppRoute, AuthorizationStatus } from "../../const";
import { PrivateRoute } from "../private-route/private-route";
import { FullOffer, OffersList } from "../../types/offer";
import MainPage from "../../pages/main-page/main-page";
import LoginPage from "../../pages/login-page/login-page";
import OfferPage from "../../pages/offer-page/offer-page";
import FavoritesPage from "../../pages/favorites-page/favorites-page";
import PageNotFound from "../../pages/page-not-found/page-not-found";


type AppMainPageProps = {
    rentalOffersCount: number;
    offers: FullOffer[];
    offersList: OffersList[];
}

function App({ rentalOffersCount, offers, offersList }: AppMainPageProps): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoute.Main}
                    element={<MainPage rentalOffersCount={rentalOffersCount} offersList={offersList} />}
                />
                <Route
                    path={AppRoute.Login}
                    element={<LoginPage />}
                />
                <Route
                    path={`${AppRoute.Offer}/:id`} 
                    element={<OfferPage offers={offers} />}
                />
                <Route
                    path={AppRoute.Favorites}
                    element={
                        <PrivateRoute
                            authorizationStatus={AuthorizationStatus.Auth}
                        >
                            <FavoritesPage offersList={offersList}/>
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