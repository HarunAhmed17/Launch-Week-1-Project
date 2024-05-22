import { React, useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import "../styles/Dashboard.css";
import { collection, getDocs } from "firebase/firestore";

export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    
    useEffect(() => {
        
        const fetchClasses = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, "dashboard")));
                console.log(querySnapshot);
                const fetchedClasses = querySnapshot.docs.map(doc => ({id: doc.id(), ...doc.data()}));
                setClasses(fetchedClasses);
                console.log(fetchedClasses);
                // console.log(querySnapshot.size);
                if (querySnapshot.empty) {
                    console.log("No documents found");
                } else {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id, " => ", doc.data());
                    });
                }
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
        };
        
        fetchClasses();
        
    }, [])


    return (
        <> 
            <Navbar />
            <div> <h1> Dashboard </h1> </div>
            <div className="classOutline"> 
                {classes.map((dashboardClass) => (
                    <div className="dashboardClass"> 
                        <h2> {dashboardClass.subject} </h2>
                        <h4> {dashboardClass.semester} </h4>
                    </div>
                ))}
            
            </div>

        </>
    )

}

