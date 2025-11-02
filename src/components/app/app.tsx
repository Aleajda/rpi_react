import React from 'react'
import MainPage from '../../pages/main-page/main-page'
import { JSX } from 'react/jsx-runtime'



type AppProps = {
    rentalOffersCount: number | null;
}

export default function App({rentalOffersCount}: AppProps): JSX.Element {
  return (
    <MainPage rentalOffersCount={rentalOffersCount}/>
  )
}
