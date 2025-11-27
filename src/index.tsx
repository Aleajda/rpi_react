import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Settings } from './consts'
import App from './components/app/app'
import { offers } from './mocks/offers'
import { offersList } from './mocks/offers-list'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App 
      rentalOffersCount={Settings.rentOffersCount}
      offers={offers}
      offersList={offersList}
    />
  </StrictMode>,
)
