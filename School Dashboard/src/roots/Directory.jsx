import React, { useState, useEffect } from 'react';
import {Navbar} from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc, deleteDoc, doc, where } from "firebase/firestore";

export const Directory = () => {
  const [students, setStudents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [sid, setSID] = useState('');
  const [sidDel, setSIDDel] = useState('');
  const [classes, setClasses] = useState('');

  const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'students')));
        // console.log("Query Snapshot:", querySnapshot); // Log the query snapshot
        const fetchedStudents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(fetchedStudents);
        // console.log("Fetched Students:", fetchedStudents); // Log the fetched students
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleAddClick = () => {
    setVisible(!visible);
  };

  const handleDeleteClick = () => {
    setDeleteVisible(!deleteVisible);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (newResponse.trim() === '') return;
    const classesArray = classes.split(',').map(cls => cls.trim());

    try {
      const docRef = await addDoc(collection(db, "students"), {
        name: name,
        dob: dob,
        classes: classesArray,
        sid: sid
      });
      // console.log("Created doc with id: ", docRef.id);
      
      setVisible(true);
      setName('');
      setClasses('');
      setDOB('');
      setSID('');
      fetchData();
      
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  

const handleDelete = async (e) => {
  e.preventDefault();

  try {
    // Query document where 'sid' field equals 'sidDel'
    const q = query(collection(db, 'students'), where('sid', '==', sidDel));
    const querySnapshot = await getDocs(q);

    // Check if there is a matching document
    if (!querySnapshot.empty) {
      // Get the document ID of the first matching document
      const docId = querySnapshot.docs[0].id;
      
      // Delete the document with the obtained ID
      await deleteDoc(doc(db, 'students', docId));

      // After deletion, fetch updated data
      fetchData();

      // Reset input field
      setSIDDel('');
    } else {
      console.log("No document found with SID:", sidDel);
    }
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};


  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>Student Directory</div>
          
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
                    value={sid}
                    onChange={(e) => setSID(e.target.value)}
                    placeholder="Student ID"
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
              !visible && !deleteVisible && <div className='add-inputs'></div>
            }

            {deleteVisible && !visible &&
                <form onSubmit={handleDelete}>
                  <div className='add-inputs'>
                    <input
                      className='name-input'
                      type="text"
                      value={sidDel}
                      onChange={(e) => setSIDDel(e.target.value)}
                      placeholder="Student ID"
                    />        
                    <button className='add-button' type="submit">Delete</button>
                  </div>
                </form>
              }
            
            <div className='button-container'>
              {visible && <button className='add-button' onClick={handleAddClick}>Cancel</button>}
              {deleteVisible && <button className='add-button' onClick={handleDeleteClick}>Cancel</button>}
              {!visible && !deleteVisible && <button className='add-button' onClick={handleAddClick}>+ Add Student</button>}
              {!deleteVisible && !visible && <button className='delete-button' onClick={handleDeleteClick}>- Delete Student</button>}
            </div>
          
          </div>
        </div>
        
        <div className='datatable-container'>
          <DataTable group={students} isTeacher={false} />
        </div>
      </div>
    </>
  );
};
