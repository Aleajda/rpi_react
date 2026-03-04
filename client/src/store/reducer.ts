import { createReducer } from '@reduxjs/toolkit';
import { AuthorizationStatus } from '../consts';
import type { State } from '../types/state';
import { offersCityList, requireAuthorization, setError, setOffersDataLoadingStatus } from './action';

const initialState: State = {
  offers: [],
  authorizationStatus: AuthorizationStatus.Unknown,
  error: null,
  isOffersDataLoading: false
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(offersCityList, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    });
});

