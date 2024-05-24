import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import '../styles/Class.css';

export const Class = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);
    const [newStudentDocId, setNewStudentDocId] = useState('');
    const [studentIdToDelete, setStudentIdToDelete] = useState('');
    const [allStudents, setAllStudents] = useState([]);

    useEffect(() => {
        const fetchClassData = async () => {
            if (classId) {
                const classDoc = await getDoc(doc(db, "classes", classId));
                if (classDoc.exists()) {
                    const data = classDoc.data();
                    const teacherDoc = await getDoc(doc(db, "teachers", data.teacher));
                    const teacherName = teacherDoc.exists() ? teacherDoc.data().name : "Unknown";

                    const students = await Promise.all(
                        data.students.map(async (studentId) => {
                            const studentDoc = await getDoc(doc(db, "students", studentId));
                            return studentDoc.exists() ? { docId: studentDoc.id, ...studentDoc.data() } : null;
                        })
                    );

                    setClassData({
                        ...data,
                        id: classDoc.id,
                        teacher: teacherName,
                        students: students.filter(Boolean),
                    });
                }
            }
        };

        const fetchAllStudents = async () => {
            const studentsSnapshot = await getDocs(collection(db, "students"));
            const studentsList = studentsSnapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
            setAllStudents(studentsList);
        };

        fetchClassData();
        fetchAllStudents();
        document.title = classId;
    }, [classId]);

    const addStudent = async () => {
        if (newStudentDocId.trim() !== '') {
            console.log('Adding student with Document ID:', newStudentDocId);
            const studentDoc = await getDoc(doc(db, "students", newStudentDocId));
            if (studentDoc.exists()) {
                const classDocRef = doc(db, "classes", classId);
                await updateDoc(classDocRef, {
                    students: arrayUnion(newStudentDocId)
                });

                setClassData(prevData => ({
                    ...prevData,
                    students: [...prevData.students, { docId: newStudentDocId, ...studentDoc.data() }]
                }));

                setNewStudentDocId('');
            } else {
                alert("Student not found in the database");
            }
        }
    };

    const removeStudent = async () => {
        if (studentIdToDelete.trim() !== '') {
            console.log('Removing student with Document ID:', studentIdToDelete);
            const studentDoc = await getDoc(doc(db, "students", studentIdToDelete));
            if (studentDoc.exists()) {
                const classDocRef = doc(db, "classes", classId);
                await updateDoc(classDocRef, {
                    students: arrayRemove(studentIdToDelete)
                });

                setClassData(prevData => ({
                    ...prevData,
                    students: prevData.students.filter(student => student.docId !== studentIdToDelete)
                }));

                setStudentIdToDelete('');
            } else {
                alert("Student not found in the database");
            }
        }
    };

    if (!classData) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="class-container">
                <h1 className="class-header">{classData.id}</h1>
                <div className="class-details">
                    <h4>Class Details:</h4>
                    <p>Teacher: {classData.teacher}</p>
                    <p>Room: {classData.room}</p>
                    <p>Average Grade: {classData.avgGrade}</p>
                    <p>Schedule: {classData.schedule}</p>
                </div>
                <div className="add-student-form">
                    <h4>Add New Student:</h4>
                    <select
                        value={newStudentDocId}
                        onChange={(e) => setNewStudentDocId(e.target.value)}
                    >
                        <option value="">Select Student</option>
                        {allStudents.map(student => (
                            <option key={student.docId} value={student.docId}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={addStudent}>
                        Add Student
                    </button>
                </div>
                <div className="remove-student-form">
                    <h4>Remove Student:</h4>
                    <select
                        value={studentIdToDelete}
                        onChange={(e) => setStudentIdToDelete(e.target.value)}
                    >
                        <option value="">Select Student</option>
                        {classData.students.map(student => (
                            <option key={student.docId} value={student.docId}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={removeStudent}>
                        Remove Student
                    </button>
                </div>
                <br />
                <div>
                    <h4>Class Roster:</h4>
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Birth</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classData.students.map((student) => (
                                <tr key={student.docId}>
                                    <td>{student.name}</td>
                                    <td>{student.dob}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Class;
