import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../consts';

export default function PageNotFound(): JSX.Element {
  return (
    <div className="page page--gray page--main">
      <main className="page__main page__main--index">
        <div className="container">
          <h1>404. Page not found</h1>
          <Link to={AppRoute.Main}>Go to main page</Link>
        </div>
      </main>
    </div>
  );
}
