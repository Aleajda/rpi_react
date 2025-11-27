import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to='/'>
        <img className='header__logo' src='img/logo.svg' alt="6 cities logo" width="81"/>
    </Link>
  )
}
