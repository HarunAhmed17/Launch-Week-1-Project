import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import DataTable from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc, deleteDoc, doc, updateDoc, where } from "firebase/firestore";
import Button from '@mui/material/Button';
// import { useGlobalState } from './GlobalStateContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobalState } from './GlobalStateContext';

export const Directory = ({ isTeacher }) => {
  //true admin, false teacher
  const {globalState, setGlobalState } = useGlobalState();
  
  const [data, setData] = useState([]);

  const [visible, setVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const [name, setName] = useState('');
  const [dob, setDOB] = useState('');
  const [id, setID] = useState('');
  const [classes, setClasses] = useState('');

  const [idToDelete, setIDToDelete] = useState('');

  const [updateID, setUpdateID] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateDOB, setUpdateDOB] = useState('');
  const [updateClasses, setUpdateClasses] = useState('');


  // const {globalState, setGlobalState } = useGlobalState();
  //   useEffect(() => {
  //       console.log(globalState);
  //       // console.log(globalState.key);
  //       // const updateGlobalState = (newState) => {
  //       //     setGlobalState(newState);
  //       // };
  //       // updateGlobalState({ ...globalState, key: 'new value' });
        
  //   }, [globalState])


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

  const clearData = () => {
    setName('');
    setClasses('');
    setDOB('');
    setID('');
    setUpdateID('');
    setUpdateName('');
    setUpdateDOB('');
    setUpdateClasses('');
    setIDToDelete('');
    setUpdateVisible(false);
    setVisible(false);
    setDeleteVisible(false);
  }

  useEffect(() => {
    fetchData();
    clearData();
    document.title = isTeacher ? "Teacher " : "Student " + 'Directory';
  }, [isTeacher, globalState]);

  const handleAddClick = () => {
    setVisible(!visible);
    setName('');
    setClasses('');
    setDOB('');
    setID('');
  };

  const handleDeleteClick = () => {
    setDeleteVisible(!deleteVisible);
    setIDToDelete('');
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
      toast.error('Please fill in all fields');
      return;
    }

    const numIdToAdd = Number(id);
    if (isNaN(id)) {
      toast.error('Please enter a valid number for id');
      // alert('Please enter a valid number for id');
      return;
    }

    const classesArray = classes.split(',').map(cls => cls.trim());

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      await addDoc(collection(db, collectionName), {
        name: name,
        dob: dob,
        classes: classesArray,
        id: numIdToAdd
      });
      toast.success("Successfully Added");
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
      toast.error('Please fill in all fields');
      return;
    }

    const numIdToDelete = Number(idToDelete);
    if (isNaN(numIdToDelete)) {
      toast.error('Please enter a valid number for id');
      return;
    }

    try {
      console.log("ID", numIdToDelete);
      const collectionName = isTeacher ? 'teachers' : 'students';

      const q = query(collection(db, collectionName), where('id', '==', numIdToDelete));
      const querySnapshot = await getDocs(q);

      // Check if there is a matching document
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;

        await deleteDoc(doc(db, collectionName, docId));

        fetchData();
        setIDToDelete('');
        toast.success("Successfully Deleted");
      } else {
        console.log("No document found with ID: " + idToDelete);
      }
    } catch (error) {
      console.log("Error deleting document: "+ error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const classesArray = updateClasses.split(',').map(cls => cls.trim());

    if (!updateName || !updateDOB || !updateID || !updateClasses) {
      toast.error('Please fill in all fields');
      return;
    }

    const numIdToUpdate = Number(updateID);
    if (isNaN(numIdToUpdate)) {
      toast.error('Please enter a valid number for the ID.');
      return;
    }

    try {
      const collectionName = isTeacher ? 'teachers' : 'students';
      console.log("id" + numIdToUpdate)
      const q = query(collection(db, collectionName), where('id', '==', numIdToUpdate));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, collectionName, docId); // Get a document reference
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
        toast.success("Successfully Updated");
      } else {
        console.log("No document found with ID: " + numIdToUpdate);
      }
    } catch (error) {
      console.log("Error updating document: " + error);
    }
  };



  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>{isTeacher ? 'Teacher Directory' : 'Student Directory'}</div>

        {globalState &&
        
        <div className='inputs-container'>
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
                    value={updateID}
                    onChange={(e) => setUpdateID(e.target.value)}
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

                </div>
              </form>
            }

            {
              !visible && !deleteVisible && !updateVisible &&
              <div className='add-inputs'></div> 
            }

            <div className='button-container'>
              {visible &&
                <div className='buttons-box'>
                <Button style={{ backgroundColor: '#476730', color: 'white', marginRight: '10px', marginBottom: '10px'}}
                    className='add-button' type="submit">Submit</Button>
                  
                <Button style={{ backgroundColor: '#476730', color: 'white', marginBottom: '10px' }}
                  className='add-button' onClick={handleAddClick}>Cancel</Button>
                </div>
                }
              
              {deleteVisible &&
                <div className='buttons-box'>
                <Button style={{ backgroundColor: '#476730', color: 'white' }}
                    className='add-button' type="submit">Delete</Button>
                  
                <Button style={{ backgroundColor: '#476730', color: 'white', marginLeft: '10px' }}
                className='add-button' onClick={handleDeleteClick}>Cancel</Button>
                </div>}
              
              {updateVisible &&
                <div className='buttons-box'>
                  <Button style={{ backgroundColor: '#476730', color: 'white', marginBottom: '10px', marginRight: '10px'  }}
                    className='add-button' type="submit">Update</Button>
                  <Button style={{ backgroundColor: '#476730', color: 'white', marginBottom: '10px' }}
                  className='add-button' onClick={() => handleUpdateClick()}>Cancel</Button>
                </div>
              }
              
              
              {!visible && !deleteVisible && !updateVisible && <Button style={{ backgroundColor: '#476730', color: 'white', marginLeft: '10px', marginBottom: '10px'  }}
                className='add-button' onClick={handleAddClick}>+ Add {isTeacher ? 'Teacher' : 'Student'}</Button>}
              
              {!deleteVisible && !visible && !updateVisible && <Button style={{ backgroundColor: '#476730', color: 'white', marginLeft: '10px', marginBottom: '10px'  }}
                className='delete-button' onClick={handleDeleteClick}>- Delete {isTeacher ? 'Teacher' : 'Student'}</Button>}
              
              {!deleteVisible && !visible && !updateVisible && <Button style={{ backgroundColor: '#476730', color: 'white', marginLeft: '10px', marginBottom: '10px'  }}
                className='update-button' onClick={() => handleUpdateClick()}>^ Update {isTeacher ? 'Teacher' : 'Student'} by ID</Button>}
            </div>
          </div>
        </div>
        }

        <div className='datatable-container'>
          <DataTable
            group={data}
            isTeacher={isTeacher}
            onEditClick={handleUpdateClick} // Pass the handleUpdateClick function to DataTable
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Directory;


