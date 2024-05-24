import { useState, useEffect } from 'react';
import React from 'react';
import '../styles/home.css'
import { Navbar } from '../components/Navbar';
import logo from '../images/logo.png'
import collaboration from '../images/collaboration.jpg'
import curiosity from '../images/curiosity.jpg'
import excellence from '../images/excellence.jpg'

export const Home = () => {
    return (
        <>
            <Navbar />
            <div className='home'>
                <div className='title-logo'>
                    <div className='main-title'>
                        <h1> &nbsp;Thomas Jefferson <br /> Elementary School</h1>
                        <h2> Inspiring Young Minds Every Day</h2>
                    </div>
                    <img className='large-logo' src={logo} alt='logo' />
                </div>
                <div className='images'>
                    <div className='curiosity-container'>
                        <h2> Curiosity </h2> 
                        <img className='curiosity' src={curiosity} alt='curiosity' />
                    </div>
                    <div className='col-imgs curiosity-container'>
                             <div className='excellence-container'>
                        <h2> Excellence </h2>
                        <img className='excellence' src={excellence} alt='excellence' />
                    </div>
                    <div className='collaboration-container'>
                        <h2> Collaboration </h2>
                        <img className='collaboration' src={collaboration} alt='collaboration' />
                    </div> 
                    </div>
                </div>
                <div className='imgs-contain'>
                    <div className='carousel-slide'>
                        <div className='curiosity-contain'>
                            <div className='carousel-text'>Curiosity</div>
                        </div>
                        <div className='excellence-contain'>
                            <div className='carousel-text'>Excellence</div>
                        </div>
                        <div className='collaboration-contain'>
                            <div className='carousel-text'>Collaboration</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
