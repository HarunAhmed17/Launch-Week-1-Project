import { React, useState, useEffect } from 'react';
import {Navbar} from "../components/Navbar";
import { db } from "../firebase";
import "../styles/Dashboard.css";
import { doc, deleteDoc, addDoc, collection, getDocs, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


export const Dashboard = () => {

    const [classes, setClasses] = useState([]);
    // data for entering in fields
    const [subject, setSubject] = useState("");
    const [semester, setSemester] = useState("");
    const [color, setColor] = useState("");

    // variable representing id to delete for removeClass
    const [idToRemove, setIdToRemove] = useState("");

    const fetchClasses = async () => {
        try {
            const querySnapshot = await getDocs(query(collection(db, "dashboard")));
            // console.log("Query Snapshot: ", querySnapshot);
            // const fetchedClasses = [];
            const fetchedClasses = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setClasses(fetchedClasses);
            console.log("Fetched Classes: ", fetchedClasses);
            console.log("Size: ", querySnapshot.size);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [])

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


    // functionality to delete Class
    const removeClass = async (docId) => {
        console.log("deleting doc with id: ", docId);
        await deleteDoc(doc(db, "dashboard", docId));
        // add fetchClasses(); --> so that it deletes immediately after button is clicked
        fetchClasses();
    }


    return (
        <>
            <Navbar />
            <div className="title">
                <h1> Dashboard </h1>
                <hr className="line" />
            </div>
            {/* form should be outside the main classOutline div */}
            <div class="form"> 
                    <form className="addClassForm" onSubmit={handleSubmit}> 
                        <Button color="success" variant="contained" type="submit"> Add Class </Button>
                        <br/>
                        <label> Subject: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="outlined" 
                        onChange={(e) => setSubject(e.target.value)} />
                        <br/>
                        <label> Semester: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="outlined" 
                        onChange={(e) => setSemester(e.target.value)} />
                        <br/>
                        <label> Color: </label>
                        <TextField id="outlined-basic" lable="Outlined" variant="outlined"
                        onChange={(e) => setColor(e.target.value)} />
                        <br/> 
                    </form>
            </div>
            <div className="classOutline">
                {classes.map((dashboardClass) => (
                    <div key={dashboardClass.id} className="dashboardClass" style={{'--box-color': dashboardClass.color}}> 
                        <Link key={dashboardClass.subject} to={`/class/${dashboardClass.subject}`}>
                            {console.log(typeof dashboardClass.subject)}
                            <hr className="line" />
                            <h4> {dashboardClass.subject} </h4>
                            <h6> {dashboardClass.semester} </h6>
                        </Link>
                        <Button size="small" color="success" variant="outlined" type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            removeClass(dashboardClass.id)
                        }}> Remove Class </Button>
                    </div>
                    
                ))}
            </div>
            
        </>
    );
};