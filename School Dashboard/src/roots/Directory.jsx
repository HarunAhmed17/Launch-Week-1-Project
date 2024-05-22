import React, { useState, useEffect } from 'react';
import {Navbar} from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query } from "firebase/firestore";

export const Directory = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);

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
      console.log(visible);
      setVisible(!visible);
      console.log(visible);
  };

    const handleSubmit = () => {
      console.log(visible);
      setVisible(true);
      console.log(visible);
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
                placeholder="Name"
              />
              <input
                className='name-input'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Date of Birth"
              />
              <input
                className='classes-input'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
