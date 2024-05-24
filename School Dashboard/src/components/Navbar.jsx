import React from 'react';
import '../index.css';
import '../styles/directory.css';
import { Link } from "react-router-dom";
import logo from '../images/logo.png'
import { useState } from 'react';
import Button from '@mui/material/Button';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="title-section">
        <img className="header-logo" src={logo} alt="Logo" />
        <div className="navbar-title"><h2> Thomas Jefferson</h2> </div>
      </div>

      <div className="right-section">
        <div className={`links-container ${menuOpen ? 'show' : ''}`}>
          <Link className="header-link" to="/">Home</Link>
          <Link className="header-link" to="/dashboard">Dashboard</Link>
          <div className="directory-link">
            <div className="header-link">Directory</div>
            <div className="directory-options">
              <div className="options-container">
                <div className="student-option">
                  <Link className="student-link" to="/student-directory-admin">Student</Link>
                </div>
                <div className="teacher-option">
                  <Link className="teacher-link" to="/teacher-directory-admin">Teacher</Link>
                </div>
              </div>
            </div>
          </div>
          <Link className="header-link" to="/calendar">Calendar</Link>
          <Button variant="contained" 
            style={{ backgroundColor: '#476730', color: 'white', marginLeft: '10px' }}
          >
            <Link to="/login" className='login-link'>Log-in</Link>
          </Button>
          {/* <Link className="header-link-button" to="/login">Log-in</Link> */}
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </header>
  );
};
