import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosInstance } from 'axios';
import type { AppDispatch, State } from '../types/state';
import type { OffersList } from '../types/offer';
import { offersCityList, requireAuthorization, setError, setOffersDataLoadingStatus } from './action';
import { saveToken, dropToken } from '../services/token';
import { APIRoute, AuthorizationStatus } from '../consts';
import type { AuthData, UserData } from '../types/user-data';

export const fetchOffersAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { dispatch, extra: api }) => {
    dispatch(setOffersDataLoadingStatus(true));
    try {
      const { data } = await api.get<OffersList>(APIRoute.Offers);
      dispatch(offersCityList(data));
    } catch (error) {
      dispatch(setError('Не удалось загрузить предложения'));
    } finally {
      dispatch(setOffersDataLoadingStatus(false));
    }
  }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    try {
      await api.get(APIRoute.Login);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
    } catch {
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  }
);

export const loginAction = createAsyncThunk<
UserData,
AuthData,
{ dispatch: AppDispatch; state: State; extra: AxiosInstance }
>(
  'user/login',
  async ({ email, password }, { dispatch, extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
      saveToken(data.token);
      dispatch(requireAuthorization(AuthorizationStatus.Auth));
      return data;
    } catch {
      dropToken();
      dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      return rejectWithValue('Login failed');
    }
  }
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
  }
);

export const clearErrorAction = createAsyncThunk(
  'clearError',
  (arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)),
      2000
    );
  }
);

