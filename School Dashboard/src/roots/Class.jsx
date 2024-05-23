import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import '../styles/Class.css';

export const Class = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);

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
                            </tr>
                        </thead>
                        <tbody>
                            {classData.students.map((student) => (
                                <tr key={student.id}>
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
