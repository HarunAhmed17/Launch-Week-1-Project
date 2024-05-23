import React, { useState, useEffect } from 'react';
import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const Class = () => {
    const { classId } = useParams();
    const [classData, setClassData] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            if (classId) {
                console.log(typeof classId)
                const classDoc = await getDoc(doc(db, "classes", classId));
                console.log("classId: "+classId);
                if (classDoc.exists()) {
                    console.log("it works");
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
            }
            else{
                console.log("hello");
            }
        };
        fetchClassData();
    }, [classId]);

    if (!classData) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <h1>Welcome!</h1>
            <div>
                <h2>Class Details:</h2>
                <h3>Class: {classData.name}</h3>
                <p>Teacher: {classData.teacher}</p>
                <p>Room: {classData.room}</p>
                <p>Average Grade: {classData.avgGrade}</p>
                <p>Schedule: {classData.schedule}</p>
                <div>
                    <h4>Students:</h4>
                    {classData.students.map((student) => (
                        <div key={student.id} style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                            <p>{student.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Class;
