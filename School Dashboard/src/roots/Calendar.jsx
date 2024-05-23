import { React, useState, useRef, useEffect, Component } from 'react';
import { Navbar } from '../components/Navbar';

import { Calendar as FullCalendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Button  from '@mui/material/Button';

import { db } from '../firebase.js';
import { getDocs, collection, query , addDoc } from "firebase/firestore";




export const Calendar = () => {

    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [event, setEvent] = useState('');
    const [isAllDay, setIsAllDay] = useState('');
    const [endTime, setEndTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [allData, setAllData] = useState([]);
    

    // const handleDateClick = (arg) => {
    //     alert(arg.dateStr)
    //   }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = await addDoc(collection(db, "events"), {
            Event: event,
            BeginningDate: startDate,
            EndDate: endDate,
            StartTime: startTime,
            EndTime: endTime,
            AllDay: isAllDay,   
        });
        console.log("created doc with id: ", docRef.id);
        fetchData();
    };



    const fetchData = async () => {
        let temp = [];
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
            temp.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        const events = temp.map(event => {
            const { BeginningDate, EndDate, Event, startTime, endTime, AllDay } = event;
            const start = `${BeginningDate}T${startTime || '00:00:00'}`;
            const end = `${EndDate ? `${EndDate}T${endTime || '23:23:59'}` : start}`;
            return {
                title: Event,
                start: start,
                end: end,
                allDay: AllDay === 'true'
            };
        });

        setAllData(events);
        console.log(allData);
    };

    useEffect(() => {

        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(date);
        }
        fetchData();
    } ,[]);


    return (
        <div>
            <Navbar />
            <h1>Calendar</h1>
            <form onSubmit={handleSubmit}>

                <label>Event Name: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>

                <label>Start Date: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>

                {/* Same Day? */}

                <label>End Date: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>
                
                {/* All Day? */}
                <label>Start Time: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>
                
                <label>End Time: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>
                
                <button type="submit">Update Calendar</button>
            </form>
            <div className='calendarcomponent'>
            <FullCalendarComponent
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                displayEventTime = {true}
                displayEventEnd = {true}
                themeSystem='standard'
                eventMouseEnter={true}
                headerToolbar={{
                    center: 'title',
                }}

         //       dateClick={handleDateClick}
                events={allData}
                  //eventDidMount={events}

            />
            </div>
     
        </div>
    );
};