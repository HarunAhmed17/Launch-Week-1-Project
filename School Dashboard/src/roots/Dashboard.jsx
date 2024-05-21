import { React, useState, useEffect } from 'react';
import { NavBar } from '../ components/Navbar';
import { db } from "../firebase";
import "../styles/Dashboard.css";
// import { addDoc, collection } from "firebase/firestore";

export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    
    useEffect(() => {
        db.collection("dashboard").onSnapshot(snapshot => {
            setClasses(snapshot.docs.map(doc => doc.data()));
        })
    }, [])


    return (
        <> 
            <NavBar />
            <h1> Dashboard </h1>
            <div className="classOutline"> 
                {classes.map((dashboardClass) => (
                    <div className="dashboardClass"> 
                        {dashboardClass.subject}
                        {dashboardClass.semester}
                    </div>
                ))}
            
            </div>

        </>
    )

}

