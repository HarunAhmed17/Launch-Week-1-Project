import { React , useState} from 'react';

import Navbar from '../ components/Navbar';
import MyCalendar from 'react-calendar'; // uppercase "MyCalendar"
import 'react-calendar/dist/Calendar.css';

export const Calendar = () => {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => {
        setDate(newDate);
    };

    const goLeft = () => {
        // Logic to go to previous month
    };

    const goRight = () => {
        // Logic to go to next month
    };

    const getCurrentDate = () => {
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        return `${month} ${year}`;
    };

    return (
        <div>
            <Navbar />
            <h1>Calendar</h1>
            <div className="calendar-navigation">
                <div className="navigation-item" onClick={goLeft}>
                    &lt;
                </div>
                <div className="navigation-item" onClick={goRight}>
                    &gt;
                </div>
                <div className="navigation-item">{getCurrentDate()}</div>
            </div>
            <MyCalendar value={date} onChange={onChange} /> {/* Use uppercase "MyCalendar" */}
        </div>
    );
};