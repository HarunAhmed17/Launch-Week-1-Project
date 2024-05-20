import { React, useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom';

export default function Home() {
    
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
