import { React, useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';

import { Calendar as FullCalendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

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
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    center: 'title',
                }}
                events={[
                    { title: 'event 1', date: '2024-05-13' , slotDuration:'02:00'},
                    { title: 'event 2', date: '2024-05-15' }
                  ]}

            />
        </div>
    );
};