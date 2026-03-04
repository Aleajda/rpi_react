import type { State } from '../types/state';
import type { AuthorizationStatusType } from '../types/authorization-status';
import type { OffersList } from '../types/offer';

export const getAuthorizationStatus = (state: State): AuthorizationStatusType =>
  state.authorizationStatus;

export const getOffers = (state: State): OffersList =>
  state.offers;

export const getError = (state: State): string | null =>
  state.error;

export const getOffersDataLoadingStatus = (state: State): boolean =>
  state.isOffersDataLoading;

