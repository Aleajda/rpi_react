import type { JSX } from 'react';

export function LoadingPage(): JSX.Element {
  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Loading</h2>
              <div className="places__sorting">
                <span className="places__sorting-caption">Loading offers...</span>
              </div>
              <div className="cities__places-list places__list tabs__content">
                <div className="spinner">Loading...</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

