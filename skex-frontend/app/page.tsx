import React, { Children } from 'react'
import Header from './Components/Layout/Header';
import StockList from './Components/StockList';
import Footer from './Components/Layout/Footer';

const page = () => {

  const isLoggedIn = true;

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <StockList/>
      <Footer/>
    </div>
  )
}

export default page
