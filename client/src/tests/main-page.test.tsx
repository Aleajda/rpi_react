import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { MainPage } from '../pages/main-page/main-page';
import { renderWithProviders } from './render-with-providers';
import { makeFakeOffer } from './mocks';
import { CITIES_LOCATION } from '../const';

vi.mock('../components/map/map', () => ({
  default: () => <div data-testid="map-mock">Map</div>,
}));

describe('MainPage', () => {
  it('рендерит пустое состояние для города без офферов', () => {
    renderWithProviders(<MainPage />, {
      storeOverrides: {
        city: CITIES_LOCATION[0],
        offers: [],
      },
    });

    expect(screen.getByText(/No places to stay available/i)).toBeInTheDocument();
    expect(screen.getByText(/We could not find any property available/i)).toBeInTheDocument();
    expect(screen.queryByTestId('map-mock')).not.toBeInTheDocument();
  });

  it('рендерит список офферов и карту, когда офферы есть', () => {
    const offers = [
      { ...makeFakeOffer(), city: CITIES_LOCATION[0], title: 'Offer One', isFavorite: false },
      { ...makeFakeOffer(), city: CITIES_LOCATION[0], title: 'Offer Two', isFavorite: true },
    ];

    renderWithProviders(<MainPage />, {
      storeOverrides: {
        city: CITIES_LOCATION[0],
        offers,
      },
    });

    expect(screen.getByText(/2 places to stay in Paris/i)).toBeInTheDocument();
    expect(screen.getByText('Offer One')).toBeInTheDocument();
    expect(screen.getByText('Offer Two')).toBeInTheDocument();
    expect(screen.getByTestId('map-mock')).toBeInTheDocument();
  });
});
