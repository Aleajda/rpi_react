import axios, { type AxiosInstance, type AxiosError, HttpStatusCode } from 'axios';
import { processErrorHandle } from './process-error-handle';
import { getToken } from './token';

const TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
    timeout: TIMEOUT
  });

  api.interceptors.request.use((config) => {
    const token = getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status >= HttpStatusCode.BadRequest) {
        processErrorHandle(error.message);
      }

      throw error;
    }
  );

  return api;
};

