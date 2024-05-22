import React, { useState, useEffect } from 'react';
import {Navbar} from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query } from "firebase/firestore";

export const Directory = () => {
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [classes, setClasses] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'students')));
        console.log("Query Snapshot:", querySnapshot); // Log the query snapshot
        const fetchedStudents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(fetchedStudents);
        console.log("Fetched Students:", fetchedStudents); // Log the fetched students
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchData(); // Call the fetchData function once when the component mounts
  }, []);

  const handleAddClick = () => {
      setVisible(!visible);
  };

    const handleSubmit = () => {
      setVisible(true);
      setName('');
      setClasses('');
      setDOB('');
  };



  return (
    <>
      <Navbar />
      <div className='directory-page'>
          <div className='directory-title'>Student Directory</div>
          <div>
          <div className='add-container'>
            {visible &&
              <div className='add-inputs'>
              <input
                className='name-input'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <input
                className='name-input'
                type="text"
                value={dob}
                onChange={(e) => setDOB(e.target.value)}
                placeholder="Date of Birth"
              />
              <input
                className='classes-input'
                type="text"
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                placeholder="Classes (comma separated)"
              />
              <button className='add-button' onClick={handleSubmit}>Submit</button>
            </div>
            }
            {
              !visible && <div className='add-inputs'></div>
            }
            
            {visible && <button className='add-button' onClick={handleAddClick}>Cancel Add</button>}
            {!visible && <button className='add-button' onClick={handleAddClick}>+ Add Student</button>}
          </div>
        </div>
        
        <div className='datatable-container'>
          <DataTable group={students} isTeacher={false} />
        </div>
      </div>
    </>
  );
};
