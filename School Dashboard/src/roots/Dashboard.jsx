import { React, useState, useEffect } from 'react';
import {Navbar} from "../components/Navbar";
import { db } from "../firebase";
import "../styles/Dashboard.css";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { Link } from "react-router-dom";

export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const querySnapshot = await getDocs(query(collection(db, "dashboard")));
                console.log("Query Snapshot: ", querySnapshot);
                // const fetchedClasses = [];
                const fetchedClasses = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setClasses(fetchedClasses);
                // console.log("Fetched Classes: ", fetchedClasses);
                // console.log("Size (expected 7): ", querySnapshot.size);
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
        };
        fetchClasses();
    }, [])


    return (
        <>
            <Navbar />
            <div className="title">
                <h1> Dashboard </h1>
                <hr className="line" />
            </div>
            <div className="classOutline">
                {classes.map((dashboardClass) => (
                    <Link key={dashboardClass.subject} to={`/class/${dashboardClass.subject}`}>
                        {console.log(typeof dashboardClass.subject)}
                        <div key={dashboardClass.id} className="dashboardClass" style={{'--box-color': dashboardClass.color}}> 
                            <hr className="line" />
                            <h5> {dashboardClass.subject} </h5>
                            <h8> {dashboardClass.semester} </h8>
                        </div>
                    </Link>
                ))}
            </div>
            {/* form should be outside the main classOutline div */}
            <div class="form"> 
                    <form className="addClassForm" onSubmit={handleSubmit}> 
                        <label> Subject: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="Outlined" 
                        onChange={(e) => setSubject(e.target.value)}></TextField>
                        <br/>

                        <label> Semester: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="Outlined" 
                        onChange={(e) => setSemester(e.target.value)}></TextField>
                        <br/>

                        <label> Color: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="Outlined"
                        onChange={(e) => setColor(e.target.value)}></TextField>

                        <Button variant="Contained" type="submit"> Add Class </Button>
                    </form>
            </div>
        </>
    );
};