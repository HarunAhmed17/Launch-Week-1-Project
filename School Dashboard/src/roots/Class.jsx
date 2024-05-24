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

                    const students = data.students;
                    let totalGrade = 0;
                    let studentCount = 0;
                    Object.values(students).forEach(grade => {
                        if (grade !== undefined) {
                            totalGrade += grade;
                            studentCount++;
                        }
                    });
                    const avgGrade = studentCount ? totalGrade / studentCount : 0;
                    setClassData({
                        ...data,
                        id: classDoc.id,
                        teacher: teacherName,
                        students,
                        avgGrade,
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
                    students: {
                        ...classData.students,
                        [newStudentDocId]: 0,
                    }
                });
                    const updatedStudents = { ...classData.students, [newStudentDocId]: 0 };
                const gradesArray = Object.values(updatedStudents).filter(grade => grade !== undefined);
                const averageGrade = gradesArray.length ? gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length : 0;
    
                setClassData(prevData => ({
                    ...prevData,
                    students: updatedStudents,
                    avgGrade: averageGrade
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
            const classDocRef = doc(db, "classes", classId);
            const updatedStudents = { ...classData.students };
            delete updatedStudents[studentIdToDelete];
            await updateDoc(classDocRef, {
                students: updatedStudents
            });
    
            const gradesArray = Object.values(updatedStudents).filter(grade => grade !== undefined);
            const averageGrade = gradesArray.length ? gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length : 0;
    
            setClassData(prevData => ({
                ...prevData,
                students: updatedStudents,
                avgGrade: averageGrade
            }));
    
            setStudentIdToDelete('');
        }
    };
    
    

    const updateGrade = async (studentId, newGrade) => {
        const classDocRef = doc(db, "classes", classId);
        await updateDoc(classDocRef, {
            [`students.${studentId}`]: newGrade
        });

        setClassData(prevData => ({
            ...prevData,
            students: {
                ...prevData.students,
                [studentId]: newGrade
            }
        }));
        const updatedStudents = { ...classData.students, [studentId]: newGrade };
        const gradesArray = Object.values(updatedStudents);
        const averageGrade = gradesArray.reduce((acc, curr) => acc + curr, 0) / gradesArray.length;
        setClassData(prevData => ({
            ...prevData,
            students: {
                ...prevData.students,
                [studentId]: newGrade
            },
            avgGrade: averageGrade
        }));
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
                        {classData.students &&
                            Object.entries(classData.students).map(([studentId, grade]) => (
                                <option key={studentId} value={studentId}>
                                    {allStudents.find(student => student.docId === studentId).name}
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
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classData.students &&
                                Object.entries(classData.students).map(([studentId, grade]) => (
                                    <tr key={studentId}>
                                        <td>
                                            {allStudents.find(student => student.docId === studentId).name}
                                        </td>
                                        <td>
                                            {allStudents.find(student => studentId === student.docId).dob}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={grade}
                                                onChange={(e) => updateGrade(studentId, parseInt(e.target.value))}
                                            />
                                        </td>
                                        <td>
                                        
                                    </td>
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
