import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Settings } from './consts'
import App from './components/app/app'
import { offers } from './mocks/offers'
import { offersList } from './mocks/offers-list'
import { reviews } from './mocks/reviews'
import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App 
        rentalOffersCount={Settings.rentOffersCount}
        offers={offers}
        offersList={offers}
        reviews={reviews}
      />
    </Provider>
  </StrictMode>,
)
