import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query, addDoc, deleteDoc, doc, updateDoc, where } from "firebase/firestore";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const NonAdminDirectory = ({ isTeacher }) => {
  const [data, setData] = useState([]);


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

  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>{isTeacher ? 'Teacher Directory' : 'Student Directory'}</div>

        <div className='datatable-container'>
          <DataTable
            group={data}
            isTeacher={isTeacher}
            // onEditClick={handleUpdateClick} // Pass the handleUpdateClick function to DataTable
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
