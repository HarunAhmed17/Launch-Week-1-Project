import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc, deleteDoc, doc, where } from "firebase/firestore";

export const Directory = ({ isTeacher }) => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [id, setID] = useState('');
  const [idToDelete, setIDToDelete] = useState('');
  const [classes, setClasses] = useState('');

  const fetchData = async () => {
    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      const querySnapshot = await getDocs(query(collection(db, collectionName)));
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isTeacher]);

  const handleAddClick = () => {
    setVisible(!visible);
  };

  const handleDeleteClick = () => {
    setDeleteVisible(!deleteVisible);
  };

  const handleUpdateClick = () => {
    setUpdateVisible(!updateVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const classesArray = classes.split(',').map(cls => cls.trim());

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      await addDoc(collection(db, collectionName), {
        name: name,
        dob: dob,
        classes: classesArray,
        id: id
      });
      setVisible(true);
      setName('');
      setClasses('');
      setDOB('');
      setID('');
      fetchData();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      const q = query(collection(db, collectionName), where('id', '==', idToDelete));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, collectionName, docId));
        fetchData();
        setIDToDelete('');
      } else {
        console.log("No document found with ID:", idToDelete);
      }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>{isTeacher ? 'Teacher Directory' : 'Student Directory'}</div>

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
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                    placeholder={isTeacher ? "Teacher ID" : "Student ID"}
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
                    value={idToDelete}
                    onChange={(e) => setIDToDelete(e.target.value)}
                    placeholder={isTeacher ? "Teacher ID" : "Student ID"}
                  />
                  <button className='add-button' type="submit">Delete</button>
                </div>
              </form>
            }

            <div className='button-container'>
              {visible && <button className='add-button' onClick={handleAddClick}>Cancel</button>}
              {deleteVisible && <button className='add-button' onClick={handleDeleteClick}>Cancel</button>}
              {!visible && !deleteVisible && <button className='add-button' onClick={handleAddClick}>+ Add {isTeacher ? 'Teacher' : 'Student'}</button>}
              {!deleteVisible && !visible && <button className='delete-button' onClick={handleDeleteClick}>- Delete {isTeacher ? 'Teacher' : 'Student'}</button>}
            </div>

          </div>
        </div>

        <div className='datatable-container'>
          <DataTable group={data} isTeacher={isTeacher} />
        </div>
      </div>
    </>
  );
};

export default Directory;
