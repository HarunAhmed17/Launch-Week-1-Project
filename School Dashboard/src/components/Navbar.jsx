import React from 'react';
import '../index.css';
import '../styles/directory.css';
import { Link } from "react-router-dom";
import logo from '../images/logo.png'

export const Navbar = () =>{
  return (
    <header className="header">

      <div className='left-section'>
        <div className='title-section'>
          <img className="header-logo" src={logo} alt="Logo" />
          <div className='navbar-title'> Thomas Jefferson Elementary School </div>
        </div>
      </div>

      <div className='right-section'>
        <Link className='header-link' to={'/'}>Home</Link>
        <Link className='header-link' to={'/dashboard'}>Dashboard</Link>
        
        <div className='directory-link'>
          <Link className='header-link' to={'/directory'}>Directory</Link>
          
          <div className='directory-options'>
            <div className='options-container'>
              <div className='student-option'>
                <Link className='student-link' to={'/directory'}>Student</Link>
              </div>
              <div className='teacher-option'>
                <Link className='teacher-link' to={'/directory'}>Teacher</Link>
              </div>
            </div>
          </div>

        </div>

        <Link className='header-link' to={'/calendar'}>Calendar</Link>

        <Link className='header-link-button' to={'/login'}>Log-in</Link>
      </div>
      
    
    </header>
  )
}