import { createAction } from '@reduxjs/toolkit';
import type { OffersList } from '../types/offer';
import type { AuthorizationStatusType } from '../types/authorization-status';

export const offersCityList = createAction<OffersList>('data/offersCityList');

export const requireAuthorization = createAction<AuthorizationStatusType>('user/requireAuthorization');

export const setError = createAction<string | null>('app/setError');

export const setOffersDataLoadingStatus = createAction<boolean>('data/setOffersDataLoadingStatus');

