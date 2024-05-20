import { React, useState } from 'react'
import { Link } from 'react-router-dom';

export const Home = () => {
    
    return (
        <> 
            <h1> Welcome Page </h1>
            <Link to={"/directory"}> Directory </Link>
            <Link to={"/dashboard"}> Dashboard </Link>
            <Link to={"/class"}> Class Page </Link>
            <Link to={"/calendar"}> Calendar </Link>
            
        </>
    )
}
