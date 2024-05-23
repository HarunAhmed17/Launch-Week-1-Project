import { React, useState, useEffect } from 'react';
import {Navbar} from "../components/Navbar";
import { db } from "../firebase";
import "../styles/Dashboard.css";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    // data for entering in fields
    const [subject, setSubject] = useState("");
    const [semester, setSemester] = useState("");
    const [color, setColor] = useState("");

    const fetchClasses = async () => {
        try {
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


    useEffect(() => {
        document.title = "Dashboard";
        fetchClasses();
        document.title = 'Dashboard';
    }, [])


    // functionality to delete Class

    // functionality that adds class
    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = await addDoc(collection(db, "dashboard"), {
            subject: subject,
            semester: semester,
            color: color
        });
        console.log("created new doc with id: ", docRef.id);
        setSubject("");
        setSemester("");
        setColor("");
        // add fetchClasses(); --> so that it shows up immediately after form is submitted
        fetchClasses();
    }

    return (
        <>
            <Navbar />
             <div className="title">
                <h1> Dashboard </h1>
                <hr className="line" />
            </div>
             <div className="form"> 
                     <form className="addClassForm" onSubmit={handleSubmit}> 
                        <Button color="success" variant="contained" type="submit"> Add Class </Button>
                        <br/> 
                        <label> Subject: </label>
                         <TextField size="small" id="outlined-basic" label="text" variant="outlined" 
                        onChange={(e) => setSubject(e.target.value)}></TextField>
                        <br/> 
                        <label> Semester: </label>
                        <TextField size="small" id="outlined-basic" label="text" variant="outlined" 
                        onChange={(e) => setSemester(e.target.value)}></TextField>
                        <br/>
                        <label> Color: </label>
                        <TextField size="small" id="outlined-basic" label="text" variant="outlined"
                        onChange={(e) => setColor(e.target.value)}></TextField>
                    </form>
            </div>
            <div className="classOutline">
                {classes.map((dashboardClass) => (
                    <div key={dashboardClass.id} className="dashboardClass" style={{'--box-color': dashboardClass.color}}> 
                        <Link key={dashboardClass.subject} to={`/class/${dashboardClass.subject}`}>
                            {console.log(typeof dashboardClass.subject)}
                            <hr className="line" />
                            <h4 style={{color: dashboardClass.color}}> {dashboardClass.subject} </h4>
                            <h6 style={{color: dashboardClass.color}}> {dashboardClass.semester} </h6>
                        </Link>
                        <Button size="small" color="success" variant="outlined" type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            removeClass(dashboardClass.id)
                        }}> Remove Class </Button>
                    </div>
                    
                ))}
            </div>
            
             <div className="form"> 
                     <form className="addClassForm" onSubmit={handleSubmit}> 
                        <label> Subject: </label>
                         <TextField id="outlined-basic" label="outlined" variant="outlined" 
                        onChange={(e) => setSubject(e.target.value)}></TextField>
                        <br/>

                        <label> Semester: </label>
                        <TextField id="outlined-basic" label="outlined" variant="outlined" 
                        onChange={(e) => setSemester(e.target.value)}></TextField>
                        <br/>

                        <label> Color: </label>
                        <TextField id="outlined-basic" label="outlined" variant="outlined"
                        onChange={(e) => setColor(e.target.value)}></TextField>

                        <Button variant="contained" type="submit"> Add Class </Button>
                    </form>
            </div>
        </>
    );
};