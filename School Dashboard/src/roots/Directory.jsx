import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query } from "firebase/firestore";

export const Directory = () => {
  const [students, setStudents] = useState([]);

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


  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>
          Student Directory
        </div>
        <div className='datatable-container'>
          <DataTable students={students} />
        </div>
      </div>
    </>
  );
};
