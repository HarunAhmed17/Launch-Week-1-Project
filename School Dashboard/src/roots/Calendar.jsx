import { React, useState, useRef, useEffect } from 'react';
import Navbar from '../ components/Navbar';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendarComponent from '@fullcalendar/react';


export const Calendar = () => {
    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());


    const getCurrentDate = () => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            const currentDate = calendarApi.getDate();
            const month = currentDate.toLocaleString('default', { month: 'long' });
            const year = currentDate.getFullYear();
            return `${month} ${year}`;
        }
        return '';
    };

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(date);
        }
    }, [date]);

    return (
        <div>
            <Navbar />
            <h1>Calendar</h1>
            <FullCalendarComponent
                ref={calendarRef}
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'timeGridWeek,timeGridDay'
                }}
                views={{
                    timeGridFourDay: {
                        type: 'timeGrid',
                        duration: { days: 4 }
                    }
                }}
            />
        </div>
    );
};