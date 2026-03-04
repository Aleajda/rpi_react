import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { getOffers } from '../../store/selectors';
import { AppRoute } from '../../consts';

export default function FavoritesPage(): JSX.Element {
  const offers = useAppSelector(getOffers);
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to={AppRoute.Main}>
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="Rent service logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            <ul className="favorites__list">
              <li className="favorites__locations-items">
                <div className="favorites__locations locations locations--current">
                  <div className="locations__item">
                    <span>Favorites</span>
                  </div>
                </div>
                <div className="favorites__places">
                  {favoriteOffers.map((offer) => (
                    <article key={offer.id} className="favorites__card place-card">
                      {offer.isPremium && (
                        <div className="place-card__mark">
                          <span>Premium</span>
                        </div>
                      )}
                      <div className="favorites__image-wrapper place-card__image-wrapper">
                        <Link to={`/offer/${offer.id}`}>
                          <img
                            className="place-card__image"
                            src={offer.previewImage}
                            width="150"
                            height="110"
                            alt={offer.title}
                          />
                        </Link>
                      </div>
                      <div className="favorites__card-info place-card__info">
                        <div className="place-card__price-wrapper">
                          <div className="place-card__price">
                            <b className="place-card__price-value">&euro;{offer.price}</b>
                            <span className="place-card__price-text">
                              &#47;&nbsp;night
                            </span>
                          </div>
                        </div>
                        <div className="place-card__rating rating">
                          <div className="place-card__stars rating__stars">
                            <span style={{ width: `${(offer.rating / 5) * 100}%` }}></span>
                            <span className="visually-hidden">Rating</span>
                          </div>
                        </div>
                        <h2 className="place-card__name">
                          <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                        </h2>
                        <p className="place-card__type">{offer.type}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="Rent service logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}
