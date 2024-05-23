import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc, deleteDoc, doc, updateDoc, where } from "firebase/firestore";

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
  const [updateID, setUpdateID] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateDOB, setUpdateDOB] = useState('');
  const [updateClasses, setUpdateClasses] = useState('');

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

  const handleUpdateClick = (item) => {
    if (item) {
      setUpdateID(item.id);
      setUpdateName(item.name);
      setUpdateDOB(item.dob);
      setUpdateClasses(item.classes.join(', '));
    }
    setUpdateVisible(!updateVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !dob || !id || !classes) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    const classesArray = classes.split(',').map(cls => cls.trim());

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      await addDoc(collection(db, collectionName), {
        name: name,
        dob: dob,
        classes: classesArray,
        id: id
      });
      setVisible(false);
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

    if (!idToDelete) {
      alert('Please fill in all fields to delete.');
      return;
    }

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

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const classesArray = updateClasses.split(',').map(cls => cls.trim());

    if (!updateName || !updateDOB || !updateID || !updateClasses) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      const docRef = doc(db, collectionName, updateID);
      await updateDoc(docRef, {
        name: updateName,
        dob: updateDOB,
        classes: classesArray
      });
      setUpdateVisible(false);
      setUpdateID('');
      setUpdateName('');
      setUpdateDOB('');
      setUpdateClasses('');
      fetchData();
    } catch (error) {
      console.error("Error updating document: ", error);
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

            {deleteVisible &&
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

            {updateVisible &&
              <form onSubmit={handleUpdateSubmit}>
                <div className='add-inputs'>
                  <input
                    className='name-input'
                    type="text"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
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
                    value={updateDOB}
                    onChange={(e) => setUpdateDOB(e.target.value)}
                    placeholder="Date of Birth"
                  />
                  <input
                    className='classes-input'
                    type="text"
                    value={updateClasses}
                    onChange={(e) => setUpdateClasses(e.target.value)}
                    placeholder="Classes (comma separated)"
                  />

                  <button className='add-button' type="submit">Update</button>
                </div>
              </form>
            }

            {
              !visible && !deleteVisible && !updateVisible &&
              <div className='add-inputs'></div> 
            }

            <div className='button-container'>
              {visible && <button className='add-button' onClick={handleAddClick}>Cancel</button>}
              {deleteVisible && <button className='add-button' onClick={handleDeleteClick}>Cancel</button>}
              {updateVisible && <button className='add-button' onClick={() => handleUpdateClick()}>Cancel</button>}
              {!visible && !deleteVisible && !updateVisible && <button className='add-button' onClick={handleAddClick}>+ Add {isTeacher ? 'Teacher' : 'Student'}</button>}
              {!deleteVisible && !visible && !updateVisible && <button className='delete-button' onClick={handleDeleteClick}>- Delete {isTeacher ? 'Teacher' : 'Student'}</button>}
              {!deleteVisible && !visible && !updateVisible && <button className='update-button' onClick={() => handleUpdateClick()}>^ Update {isTeacher ? 'Teacher' : 'Student'}</button>}
            </div>
          </div>
        </div>

        <div className='datatable-container'>
          <DataTable
            group={data}
            isTeacher={isTeacher}
            onEditClick={handleUpdateClick} // Pass the handleUpdateClick function to DataTable
          />
        </div>
      </div>
    </>
  );
};

export default Directory;
