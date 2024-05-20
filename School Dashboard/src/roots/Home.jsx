import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
    
    return (
        <> 
            <h1> Welcome Page </h1>
            <Link to={"/directory"}> Directory </Link>
            <br/>
            <Link to={"/dashboard"}> Dashboard </Link>
            <br/>
            <Link to={"/class"}> Class Page </Link>
            <br/>
            <Link to={"/calendar"}> Calendar </Link>
            <br/>
            
        </>
    )
}
