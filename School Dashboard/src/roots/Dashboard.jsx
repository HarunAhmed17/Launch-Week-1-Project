import { React, useState, useEffect } from 'react';
import {Navbar} from "../components/Navbar";
import { db } from "../firebase";
import "../styles/Dashboard.css";
import { collection, getDocs, query } from "firebase/firestore";

export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    
    // async function fetchFirestoreData() {
    //     const querySnapshot = await getDocs(collection(db, "dashboard"));

    //     const data = [];
    //     querySnapshot.forEach((doc) => {
    //         data.push({id: doc.id, ...doc.data()});
    //     })
    //     console.log(data);
    //     return data;
    // }
    
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // const data = await fetchFirestoreData();
                // setClasses(data);
                const querySnapshot = await getDocs(query(collection(db, "dashboard")));
                console.log("Query Snapshot: ", querySnapshot);
                // const fetchedClasses = [];
                const fetchedClasses = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setClasses(fetchedClasses);
                console.log("Fetched Classes: ", fetchedClasses);
                console.log("Size (expected 7): ", querySnapshot.size);
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
                    <div key={dashboardClass.id} className="dashboardClass"> 
                        <h2> {dashboardClass.subject} </h2>
                        <h4> {dashboardClass.semester} </h4>
                    </div>
                ))}
            
            </div>

        </>
    )

}

