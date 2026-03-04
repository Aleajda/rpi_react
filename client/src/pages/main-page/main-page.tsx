import type { JSX } from 'react';
import CitiesCard from '../../components/cities-card/cities-card';
import { useAppSelector } from '../../hooks';
import { getOffers, getOffersDataLoadingStatus } from '../../store/selectors';
import { LoadingPage } from '../../components/loading-page/loading-page';

export default function MainPage(): JSX.Element {
  const offers = useAppSelector(getOffers);
  const isOffersDataLoading = useAppSelector(getOffersDataLoadingStatus);

  const parisOffers = offers.filter((offer) => offer.city.name === 'Paris');

  if (isOffersDataLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link header__logo-link--active">
                <img className="header__logo" src="img/logo.svg" alt="Rent service logo" width="81" height="41" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <ul className="locations__list tabs__list">
              <li className="locations__item">
                <a className="locations__item-link tabs__item tabs__item--active">
                  <span>Paris</span>
                </a>
              </li>
            </ul>
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{parisOffers.length} places to stay in Paris</b>
              <form className="places__sorting" action="#" method="get">
                <span className="places__sorting-caption">Sort by</span>
                <span className="places__sorting-type" tabIndex={0}>
                  Popular
                  <svg className="places__sorting-arrow" width="7" height="4">
                    <use href="#icon-arrow-select"></use>
                  </svg>
                </span>
              </form>
              <div className="cities__places-list places__list tabs__content">
                {parisOffers.map((offer) => (
                  <CitiesCard key={offer.id} offer={offer} />
                ))}
              </div>
            </section>
            <div className="cities__right-section">
              <section className="cities__map map"></section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}