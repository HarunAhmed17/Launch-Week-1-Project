import React, { useState, useEffect } from 'react';
import {Navbar} from '../components/Navbar';
import { DataTable } from '../components/DataTable';
import { db } from "../firebase.js";
import { getDocs, collection, query } from "firebase/firestore";

export const TeacherDirectory = () => {
  const [teachers, setTeachers ] = useState([]);

  useEffect(() => {
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

    fetchData(); // Call the fetchData function once when the component mounts
  }, []);


  return (
    <>
      <Navbar />
      <div className='directory-page'>
        <div className='directory-title'>
          Teacher Directory
        </div>
        <div className='datatable-container'>
          <DataTable group={teachers} isTeacher={true} />
        </div>
      </div>
    </>
  );
};
