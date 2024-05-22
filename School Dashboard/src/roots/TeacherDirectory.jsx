import React, { useState, useEffect } from 'react';
import {Navbar} from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc } from "firebase/firestore";

export const TeacherDirectory = () => {
  const [teachers, setTeachers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [classes, setClasses] = useState('');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'teachers')));
      const fetchedTeachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeachers(fetchedTeachers);
      console.log("Fetched Teahcers:", fetchedTeachers); // Log the fetched students
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };
    
  useEffect(() => {
    fetchData(); // Call the fetchData function once when the component mounts
  }, []);

  const handleAddClick = () => {
      setVisible(!visible);
  };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // if (newResponse.trim() === '') return;
      const classesArray = classes.split(',').map(cls => cls.trim());

      try {
        const docRef = await addDoc(collection(db, "teachers"), {
          name: name,
          dob: dob,
          classes: classesArray
        });
        console.log("Created doc with id: ", docRef.id);
        
        setVisible(true);
        setName('');
        setClasses('');
        setDOB('');
        fetchData();
        
      } catch (error) {
        console.error("Error adding document: ", error);
      }
  };




  return (
    <>
      <Navbar />
      <div className='directory-page'>
          <div className='directory-title'>Teacher Directory</div>
          <div>
          <div className='add-container'>
            {visible &&
              <form onSubmit={handleSubmit}>
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
                  
                  <button className='add-button' type="submit">Submit</button>
                </div>
              </form>
            }
            {
              !visible && <div className='add-inputs'></div>
            }
            
            {visible && <button className='add-button' onClick={handleAddClick}>Cancel Add</button>}
            {!visible && <button className='add-button' onClick={handleAddClick}>+ Add Student</button>}
          </div>
        </div>
        
        <div className='datatable-container'>
          <DataTable group={teachers} isTeacher={true} />
        </div>
      </div>
    </>
  );
};