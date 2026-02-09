import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Settings } from './consts'
import App from './components/app/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App rentalOffersCount={Settings.rentOffersCount}/>
  </StrictMode>,
)
