import { React, useState, useRef, useEffect, Component } from 'react';
import { Navbar } from '../components/Navbar';

import { Calendar as FullCalendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import Button  from '@mui/material/Button';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { db } from '../firebase.js';
import { getDocs, collection, query , addDoc } from "firebase/firestore";
import "../styles/calendar.css";



export const Calendar = () => {

    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [event, setEvent] = useState('');
    const [isAllDay, setIsAllDay] = useState(true);
    const [endTime, setEndTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [allData, setAllData] = useState([]);
    const [isDifferentDayChecked, setIsDifferentDayChecked] = useState(false); 
    const [isAllDayChecked, setIsAllDayChecked] = useState(true);
    const [isEnterEventVisible, setisEnterEventVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [timeSlots, setTimeSlots] = useState([]);

    // const handleDateClick = (arg) => {
    //     alert(arg.dateStr)
    //   }

    const validateDates = () => {
        // Check if the dates are in the correct format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || (isDifferentDayChecked && endDate && !dateRegex.test(endDate))) {
            alert("Please enter dates in YYYY-MM-DD format.");
            return false;
        }
    
        // Function to check if the date is valid (correct month and day range)
        const isValidDate = (dateStr) => {
            const dateParts = dateStr.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
    
            // Check month and day are within valid ranges
            if (month < 1 || month > 12 || day < 1 || day > 31) {
                return false;
            }
    
            // Use Date object to check if the date is valid
            const dateObj = new Date(year, month - 1, day);
            return dateObj.getFullYear() === year && dateObj.getMonth() === (month - 1) && dateObj.getDate() === day;
        };
    
        // Validate start date
        if (!isValidDate(startDate)) {
            alert("Invalid start date. Please check your date values.");
            return false;
        }
    
        // Validate end date if different day is checked
        if (isDifferentDayChecked && endDate && !isValidDate(endDate)) {
            alert("Invalid end date. Please check your date values.");
            return false;
        }
    
        // Convert the dates to Date objects for comparison
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        // Check if the end date comes after the start date
        if (isDifferentDayChecked && endDate && end <= start) {
            alert("End date must be after the start date.");
            return false;
        }
    
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateDates()) {
            return; // Stop the form submission if validation fails
        }
        let eventData = {
            Event: event,
            AllDay: isAllDayChecked,
            BeginningDate: startDate
        };
        if (endDate) eventData.EndDate = adjustEndDate(endDate);
        if (!isAllDayChecked) {
            if (startTime) eventData.startTime = startTime;
            if (endTime) eventData.endTime = endTime;
        }
        const docRef = await addDoc(collection(db, "events"), eventData);
        console.log("created doc with id: ", docRef.id);
        fetchData();
    };

    const adjustEndDate = (date) => {
        const result = new Date(date);
        result.setDate(result.getDate() + 1); // Adds one day
        return result.toISOString().split('T')[0]; // Returns the adjusted date as a string
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
                allDay: AllDay === true
            };
        });

        setAllData(events);
        console.log(allData);
    };

    useEffect(() => {
        setTimeSlots(generateTimeSlots());
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(date);
        }
        fetchData();
    } ,[]);

    const handleDateClick = (info) => {
    alert('Clicked on: ' + info.dateStr);
    if(isDifferentDayChecked){
        document.getElementById('EndDateTextBox').value = info.dateStr;
        setEndDate(info.dateStr);
    }else{
        document.getElementById('StartDateTextBox').value = info.dateStr;
        setStartDate(info.dateStr);
    }

    }

    const handleEventClick = (info) => {
        alert('Event: ' + info.event.title);
        }

    const handleDifferentDayCheckboxChange = () => {
        setIsDifferentDayChecked(!isDifferentDayChecked);
    };

    const handleAllDayCheckboxChange = () => {
        setIsAllDayChecked(!isAllDayChecked);
    }

    const handleEnterEventClick = () => {
        setisEnterEventVisible(!isEnterEventVisible);
        setIsButtonVisible(false);
    }
    const handleDeleteClick = (info) => {
        const event = info.event;
        if (window.confirm(`Are you sure you want to delete the event: ${event.title}?`)) {
            deleteEvent(event.id);
        }
    };
    
    const deleteEvent = async (eventId) => {
        try {
            await db.collection("events").doc(eventId).delete();
            alert('Event has been deleted.');
            fetchData(); // Refresh the list of events
        } catch (error) {
            console.error("Error removing document: ", error);
            alert('Failed to delete the event.');
        }
    };
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const militaryTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                const period = hour >= 12 ? 'PM' : 'AM';
                const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                const standardTime = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
                const timeLabel = `${standardTime} (${militaryTime})`;
                slots.push({ militaryTime, timeLabel });
            }
        }
        return slots;
    };

    return (
        <div>
            <Navbar />

            <h1>Calendar</h1>


            {isButtonVisible && (<button onClick={handleEnterEventClick} id='EventButtonClick'>Enter An Event</button>)}
                {isEnterEventVisible && (<div>
                <form onSubmit={handleSubmit}>

                <label>Event Name: </label>
                <input type="text" onChange={(e) =>setEvent(e.target.value)}></input>
                <br></br>

                <label>Start Date: </label>
                <input type="text" placeholder= 'YYYY-MM-DD' onChange={(e) =>setStartDate(e.target.value)} id='StartDateTextBox'></input>
                <br></br>

                {/* Same Day? */}
                <label> <input type = "checkbox" checked={isDifferentDayChecked} onChange={handleDifferentDayCheckboxChange}/>End Date is Different?</label>
                <br></br>
                {isDifferentDayChecked && (<div id='EndDateBox' >
                <label>End Date: </label>
                <input type="text" id='EndDateTextBox' onChange={(e) =>setEndDate(e.target.value)}></input>
                </div>)}


                {/* All Day? */}
                {!isDifferentDayChecked && (<div id="alldaystartend">
                <label> <input type = "checkbox" checked={isAllDayChecked} onChange={handleAllDayCheckboxChange} id="AllDayCheckbox"/>All Day?</label>
                {!isAllDayChecked && (<div>
                    <label>Start Time:</label>
                    <select value={startTime} onChange={e => setStartTime(e.target.value)}>
                        {timeSlots.map(slot => (
                            <option key={slot.militaryTime} value={slot.militaryTime}>
                                {slot.timeLabel}
                            </option>
                        ))}
                    </select>

                    <label>End Time:</label>
                    <select value={endTime} onChange={e => setEndTime(e.target.value)}>
                        {timeSlots.map(slot => (
                            <option key={slot.militaryTime} value={slot.militaryTime}>
                                {slot.timeLabel}
                            </option>
                        ))}
                    </select>
                </div> )}
                <br></br>
                </div>
                )}

                <button type="submit">Update Calendar</button>
                </form>
                </div>)}


            {/* <button>Delete Event</button>
                 */}



            <div className='calendarcomponent'>
            <FullCalendarComponent
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                displayEventTime = {true}
                displayEventEnd = {true}
                dateClick={handleDateClick}
                themeSystem='standard'
                eventMouseEnter={true}
                eventClick = {handleEventClick}
                headerToolbar={{
                    start: '',
                    center: 'title',
                }}
                events={allData}
                selectable = {true}

            />
            </div>
     
        </div>
    );
};