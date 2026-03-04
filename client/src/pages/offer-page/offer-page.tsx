import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { FullOffer } from '../../types/offer';
import { api } from '../../store';
import { AppRoute } from '../../consts';

type OfferPageParams = {
  id: string;
};

export default function OfferPage(): JSX.Element {
  const { id } = useParams<OfferPageParams>();
  const [offer, setOffer] = useState<FullOffer | null>(null);

  useEffect(() => {
    const loadOffer = async () => {
      if (!id) {
        return;
      }

      const { data } = await api.get<FullOffer>(`/offers/${id}`);
      setOffer(data);
    };

    loadOffer();
  }, [id]);

  if (!offer) {
    return (
      <div className="page">
        <main className="page__main page__main--offer">
          <p>Loading offer...</p>
        </main>
      </div>
    );
  }

  const ratingWidth = `${(offer.rating / 5) * 100}%`;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to={AppRoute.Main}>
                <img className="header__logo" src="img/logo.svg" alt="Rent service logo" width="81" height="41" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {offer.photos.map((photo) => (
                <div key={photo} className="offer__image-wrapper">
                  <img className="offer__image" src={photo} alt={offer.title} />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {offer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">
                  {offer.title}
                </h1>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: ratingWidth }}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">{offer.rating}</span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">
                  {offer.type}
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {offer.guests} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">&euro;{offer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {offer.features.map((feature) => (
                    <li key={feature} className="offer__inside-item">{feature}</li>
                  ))}
                </ul>
              </div>
              {offer.host && (
                <div className="offer__host">
                  <h2 className="offer__host-title">Meet the host</h2>
                  <div className="offer__host-user user">
                    <div className={`offer__avatar-wrapper user__avatar-wrapper${offer.host.isPro ? ' offer__avatar-wrapper--pro' : ''}`}>
                      <img className="offer__avatar user__avatar" src={offer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                    </div>
                    <span className="offer__user-name">{offer.host.name}</span>
                    {offer.host.isPro && <span className="offer__user-status">Pro</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <section className="offer__map map"></section>
        </section>
      </main>
    </div>
  );
}
