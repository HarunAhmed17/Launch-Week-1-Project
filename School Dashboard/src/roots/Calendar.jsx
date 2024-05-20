import { React } from 'react';

import Navbar from '../ components/Navbar';

export const Calendar = () => {

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

        <Navbar/>
   
        <h1 className='calendartitle'>
            Calendar
        </h1>
              <div className="calendar-navigation">
                <div className="navigation-item" onClick={goLeft}>
                    &lt;
                </div>
                <div className="navigation-item">{getCurrentDate()}</div>
                <div className="navigation-item" onClick={goRight}>
                    &gt;
                </div>

            </div>
        </div>
    );
};