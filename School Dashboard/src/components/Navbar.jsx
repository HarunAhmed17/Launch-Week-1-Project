import React from 'react';
import '../index.css';
import '../styles/directory.css';
import { Link } from "react-router-dom";
import logo from '../images/logo.png'
import { useState } from 'react';
import Button from '@mui/material/Button';
import { useGlobalState } from '../roots/GlobalStateContext';


export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const {globalState, setGlobalState } = useGlobalState();
  const handleClick = (loginPerson) => {
    const updateGlobalState = (newState) => {
      setGlobalState(newState)
    }
    if (loginPerson === "admin") {
      updateGlobalState({ ...globalState, key: true });
    }
    else {
      updateGlobalState({ ...globalState, key: false });
    }
    console.log(globalState);
  }
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleLogin = () => {
    setLoginOpen(!loginOpen);
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
          <div className="login-link">
            <div className="header-link">Log-in</div>
            <div className="login-options">
              <div className="options-container">
                <div className="admin-option-login">
                  <Button style={{color: "white"}} className="student-link" onClick={() => handleClick("admin")}>Admin</Button>
                </div>
                <div className="teacher-option-login">
                  <Button style={{color: "white"}} className="teacher-link" onClick={() => handleClick("teacher")}>Teacher</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        
        <div className="hotdog" onClick={toggleLogin}>
          <div></div>
          <div></div>
          <div></div>
        </div>

      </div>
    </header>
  );
};