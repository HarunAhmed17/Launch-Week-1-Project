import React from 'react';
import '../index.css';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="header">

      <div className='left-section'>
        <div className='navbar-title'> Thomas Jefferson Elementary School </div>
      </div>

      <div className='right-section'>
        <Link className='header-link' to={'/'}>Home</Link>
        <Link className='header-link' to={'/dashboard'}>Dashboard</Link>
        <Link className='header-link' to={'/directory'}>Directory</Link>
        <Link className='header-link' to={'/calendar'}>Calendar</Link>
      </div>
      
    
    </header>
  )
}

export default Navbar