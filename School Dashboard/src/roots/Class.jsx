import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion, query, collection, where, getDocs, deleteDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import '../styles/Class.css';

export const Class = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [newStudentId, setNewStudentId] = useState('');
    const [studentIdToDelete, setStudentIdToDelete] = useState('');

    useEffect(() => {
        const fetchClassData = async () => {
            if (classId) {
                console.log(typeof classId);
                const classDoc = await getDoc(doc(db, "classes", classId));
                console.log("classId: " + classId);
                if (classDoc.exists()) {
                    const data = classDoc.data();
                    const teacherDoc = await getDoc(doc(db, "teachers", data.teacher));
                    const teacherName = teacherDoc.exists() ? teacherDoc.data().name : "Unknown";

                    const students = await Promise.all(
                        data.students.map(async (studentId) => {
                            const studentDoc = await getDoc(doc(db, "students", studentId));
                            return studentDoc.exists() ? { id: studentDoc.id, ...studentDoc.data() } : null;
                        })
                    );

                    setClassData({
                        ...data,
                        id: classDoc.id,
                        teacher: teacherName,
                        students: students.filter(Boolean),
                    });
                }
            } else {
                console.log("hello");
            }
        };
        fetchClassData();
        document.title = classId;
    }, [classId]);

    const addStudent = async () => {
        if (newStudentId.trim() !== '') {
            // Get the student data from Firestore
            const studentDoc = await getDoc(doc(db, "students", newStudentId));
            if (studentDoc.exists()) {
                // Update Firestore
                const classDocRef = doc(db, "classes", classId);
                await updateDoc(classDocRef, {
                    students: arrayUnion(newStudentId)
                });

                // Update local state
                setClassData(prevData => ({
                    ...prevData,
                    students: [...prevData.students, { id: newStudentId, ...studentDoc.data() }]
                }));

                // Clear the input field
                setNewStudentId('');
            } else {
                alert("Student not found in the database");
            }
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!studentIdToDelete) {
            alert('Please fill in all fields');
            return;
        }

        try {
            console.log("ID to delete:", studentIdToDelete);

            const classDocRef = doc(db, "classes", classId);
            await updateDoc(classDocRef, {
                students: arrayRemove(studentIdToDelete)
            });

            // Remove student document from Firestore
            const q = query(collection(db, "students"), where('id', '==', studentIdToDelete));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await deleteDoc(doc(db, "students", docId));
            } else {
                console.log("No document found with ID: " + studentIdToDelete);
            }

            // Update local state
            setClassData(prevData => ({
                ...prevData,
                students: prevData.students.filter(student => student.id !== studentIdToDelete)
            }));

            setStudentIdToDelete('');
            alert("Successfully Deleted");
        } catch (error) {
            console.log("Error deleting document: " + error);
        }
    };

    if (!classData) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="class-container">
                <h1 className="class-header">{classData.id}</h1>
                <div className="class-details">
                    <h2>Class Details:</h2>
                    <p>Teacher: {classData.teacher}</p>
                    <p>Room: {classData.room}</p>
                    <p>Average Grade: {classData.avgGrade}</p>
                    <p>Schedule: {classData.schedule}</p>
                </div>
                <div>
                    <h4>Class Roster:</h4>
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classData.students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.dob}</td>
                                    <td>
                                        <button onClick={() => setStudentIdToDelete(student.id)}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleDelete}>Confirm Delete</button>
                </div>
                <div className="add-student-form">
                    <h4>Add New Student:</h4>
                    <input
                        type="text"
                        value={newStudentId}
                        onChange={(e) => setNewStudentId(e.target.value)}
                        placeholder="Enter Student ID"
                    />
                    <button onClick={addStudent}>
                        Add Student
                    </button>
                </div>
            </div>
        </>
    );
};

export default Class;
