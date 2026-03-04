import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/app/app';
import { store } from './store';
import { ErrorMessage } from './components/error-message/error-message';
import { checkAuthAction, fetchOffersAction } from './store/api-actions';

store.dispatch(checkAuthAction());
store.dispatch(fetchOffersAction());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorMessage />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
