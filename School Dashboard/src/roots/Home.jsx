import { useState } from 'react';
import React from 'react';
import '../styles/home.css'
import Navbar from '../components/Navbar';
import logo from '../images/logo.png'
import collaboration from '../images/collaboration.jpg'
import curiosity from '../images/curiosity.jpg'
import excellence from '../images/excellence.jpg'

export const Home = () => {
    
    return (
        <>
        <div className='home'>
           <Navbar/>
           <div className='title-logo'>
            <div className='main-title'> <h1> &nbsp;Thomas Jefferson <br/> Elementary School</h1> <h2> Inspiring Young Minds Every Day</h2>
              </div>
                <img className='large-logo' src={logo} alt='logo'/>
           </div>

           <div className='images'>
                <div > 
                    <div className='curiosity-container'>
                        <h2> Curiosity </h2>
                        <img src={curiosity} alt='curiosity'/>
                    </div>
                </div>
                <div className='col-imgs'> 
                    <div className='excellence-container'>
                        <h2> Excellence </h2>
                        <img className='excellence' src={excellence} alt='excellence'/>
                    </div>
                    <div className='collaboration-container'>
                    <h2> Collaboration </h2>
                        <img className='collaboration' src={collaboration} alt='collaboration'/>
                    </div>
                </div>
               
           </div>
        </div>
        </>
    )
}
