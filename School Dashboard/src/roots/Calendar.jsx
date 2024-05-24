import React, { useState, useRef, useEffect, Component } from 'react';
import { Navbar } from '../components/Navbar';

import { Calendar as FullCalendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendarComponent from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import { db } from '../firebase.js';
import { getDocs, collection, query, addDoc, deleteDoc, doc, updateDoc, where } from "firebase/firestore";
import "../styles/calendar.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Checkbox, Button, FormControlLabel, Select, MenuItem, FormControl, InputLabel } from '@mui/material';



export const Calendar = () => {

    const calendarRef = useRef(null);
    const [date, setDate] = useState(new Date());

    const [event, setEvent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isAllDayChecked, setIsAllDayChecked] = useState(true);
    const [isDifferentDayChecked, setIsDifferentDayChecked] = useState(false); 
    const [endTime, setEndTime] = useState('');
    const [startTime, setStartTime] = useState('');
    const [allData, setAllData] = useState([]);

    const [updateEvent, setUpdateEvent] = useState('');
    const [updateStartDate, setUpdateStartDate] = useState('');
    const [updateEndDate, setUpdateEndDate] = useState('');
    const [updateIsAllDayChecked, setUpdateIsAllDayChecked] = useState(true);
    const [updateIsDifferentDayChecked, setUpdateIsDifferentDayChecked] = useState(false); 
    const [updateEndTime, setUpdateEndTime] = useState('');
    const [updateStartTime, setUpdateStartTime] = useState('');
    const [updateAllData, setUpdateAllData] = useState([]);
    const [currentEventTitle, setCurrentEventTitle] = useState('');

    const [timeSlots, setTimeSlots] = useState([]);
    const [viewEditEventDialogOpen, setViewEditEventDialogOpen] = useState(false);
    const [viewEditDeleteEventDialogOpen, setViewEditDeleteEventDialogOpen] = useState(false);  
    const [viewMakeDialogOpen, setViewMakeDialogOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
      const [isAllDay, setIsAllDay] = useState(true);
    // const [idNumber,setIDNumber] = useState(Number);

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
    
        // checks for valid end date if different day is checked
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


    const resetFormFields = () => {
        setEvent(''); // Reset the event name
        setStartDate(''); // Reset the start date
        setEndDate(''); // Reset the end date if any
        setIsAllDayChecked(true);
        setIsDifferentDayChecked(false); // Uncheck and hide the end date field
        setStartTime(''); // Reset start time
        setEndTime(''); // Reset end time
    };

    const resetUpdateFormFields = () => {
        setUpdateEvent(''); // Reset the event name
        setUpdateStartDate(''); // Reset the start date
        setUpdateEndDate(''); // Reset the end date if any
        setUpdateIsAllDayChecked(true);
        setUpdateIsDifferentDayChecked(false); // Uncheck and hide the end date field
        setUpdateStartTime(''); // Reset start time
        setUpdateEndTime(''); // Reset end time
        setCurrentEventTitle(''); // Set the current event title
    };

    const validateTimeRange = (startTime, endTime) => {
        if (startTime >= endTime) {
            alert("End time must be after start time.");
            return false;
        }
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!event || !startDate || (!isAllDayChecked && (!startTime || !endTime)) || (isDifferentDayChecked && !endDate)) {
            alert("Please fill out all required fields.");
            return;
        }
        if (!updateIsAllDayChecked && !validateTimeRange(updateStartTime, updateEndTime)) {
            return; // Stop the form submission if time range validation fails
        }
        if (!validateDates()) {
            return; // Stop the form submission if validation fails
        }
        let eventData = {
            Event: event,
            AllDay: isAllDayChecked,
            BeginningDate: startDate,
            // ID: idNumber
        };
        if (isDifferentDayChecked) if(endDate) eventData.EndDate = adjustEndDate(endDate);
        if (!isAllDayChecked) {
            if (startTime) eventData.startTime = startTime;
            if (endTime) eventData.endTime = endTime;
        }
        const docRef = await addDoc(collection(db, "events"), eventData);
        console.log("created doc with id: ", docRef.id);
        eventData.id = docRef.id; 
        setAllData([...allData, eventData]);
        fetchData();
        setViewMakeDialogOpen(false);
        resetFormFields();
    };

    const handleEditClick = () => {
        setViewEditEventDialogOpen(true);
        setViewEditDeleteEventDialogOpen(false);
    }
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
        //getLastId();
        //console.log(getLastId());
        document.title = "Calendar";
    } ,[]);

    const handleEventClick = (info) => {
        resetFormFields();
        resetUpdateFormFields();
        setViewEditDeleteEventDialogOpen(true);
        setEvent(info.event.title);
        setStartDate(info.event.start.toISOString().split('T')[0]);
        if(info.event.end) setEndDate(info.event.end.toISOString().split('T')[0]);
        setIsAllDayChecked(info.event.allDay);
        setUpdateEvent(info.event.title);
        setUpdateStartDate(info.event.start.toISOString().split('T')[0]);
        if(info.event.end) setUpdateEndDate(info.event.end.toISOString().split('T')[0]);
        setUpdateIsAllDayChecked(info.event.allDay);
        setCurrentEventTitle(info.event.title); // Set the current event title
        console.log(info.event.start);
    };
    

    const editEvent = async () => {
        if (!updateEvent || !updateStartDate || (!updateIsAllDayChecked && (!updateStartTime || !updateEndTime)) || (updateIsDifferentDayChecked && !updateEndDate)) {
            alert("Please fill out all required fields.");
            return;
        }
        if (!updateIsAllDayChecked && !validateTimeRange(updateStartTime, updateEndTime)) {
            return; // Stop the form submission if time range validation fails
        }
        try {
            console.log("Event Name:", event, "Event Date:", startDate);
            const collectionName = 'events'; // Assuming your events are stored in a collection named 'events'
            
            // Query for documents where the 'Event' field matches the provided event name and date
            const q = query(collection(db, collectionName), where('Event', '==', event));
            const querySnapshot = await getDocs(q);
            
            // Check if there is a matching document
            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                const docRef = doc(db, collectionName, docId); // Correctly get the document reference
    
                let eventData = {
                    Event: updateEvent,
                    AllDay: updateIsAllDayChecked,
                    BeginningDate: updateStartDate,
                };
    
                if (updateIsDifferentDayChecked) {
                    if (updateEndDate) eventData.EndDate = adjustEndDate(updateEndDate);
                }
                if (!updateIsAllDayChecked) {
                    if (updateStartTime) eventData.startTime = updateStartTime;
                    if (updateEndTime) eventData.endTime = updateEndTime;
                }
    
                await updateDoc(docRef, eventData);
    
                fetchData();
                alert("Successfully Updated");
            } else {
                console.log("No document found with Event name: " + event);
            }
        } catch (error) {
            console.log("Error updating document: " + error);
        }
    };
      


    const handleDifferentDayCheckboxChange = () => {
        setIsDifferentDayChecked(!isDifferentDayChecked);
            if (!isDifferentDayChecked) {
                setEndDate(''); // Clear end date when checkbox is unchecked
            }
        };

    const handleAllDayCheckboxChange = () => {
        setIsAllDayChecked(!isAllDayChecked);
    }

    const handleUpdateAllDayCheckboxChange = () => {
        setUpdateIsAllDayChecked(!updateIsAllDayChecked);
    }
    const closeEditEvent = () => {
        setViewEditEventDialogOpen(false);
    }
    const handleDelete = async (e) => {

        try {
          console.log("Event Name:", event, "Event Date:", startDate);
          const collectionName = 'events';  // Assuming your events are stored in a collection named 'events'
      
          // Query for documents where the 'Event' field matches the provided event name and date
          const q = query(collection(db, collectionName), where('Event', '==', event));
          const querySnapshot = await getDocs(q);
          // Check if there is a matching document
          if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;

            await deleteDoc(doc(db, collectionName, docId));
    
      
            fetchData();  // Assuming you have a function to refresh the data shown in your app
            alert(`Successfully deleted events named '${event}' on '${startDate}'`);
          } else {
            console.log(`No document found with event name: ${event} and date: ${startDate}`);
            alert(`No event found with the name '${event}' on '${startDate}'`);
          }
        } catch (error) {
          console.error("Error deleting document: ", error);
          alert(`Error deleting events: ${error.message}`);
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
                {/* THIS IS THE EDIT WINDOW TO CHOOSE EDIT DELETE OR CANCEL */}
                <Dialog
                    open={viewEditDeleteEventDialogOpen}
                    onClose={() => setViewEditDeleteEventDialogOpen(false)}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Select Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to edit or delete "{currentEventTitle}"
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {handleEditClick(); setViewEditDeleteEventDialogOpen(false);}} color="primary">
                            Edit
                        </Button>
                        <Button onClick={() => { handleDelete(); setViewEditDeleteEventDialogOpen(false); }} color="primary">
                            Delete
                        </Button>
                        <Button onClick={() => setViewEditDeleteEventDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            <Navbar />

     {/* THIS IS THE EDITING AN EXISTING EVENT ON THE CALENDAR */}
            <Dialog open={viewEditEventDialogOpen} onClose={() => setViewEditEventDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit an Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the new details of the event.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Event Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={updateEvent}
                        onChange={(e) => setUpdateEvent(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        value={updateStartDate}
                        onChange={(e) => setUpdateStartDate(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={updateIsDifferentDayChecked} onChange={setUpdateIsDifferentDayChecked} />}
                        label="End Date is Different?"
                    />
                    {updateIsDifferentDayChecked && (
                        <TextField
                            margin="dense"
                            id="endDate"
                            label="End Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            value={updateEndDate}
                            onChange={(e) => setUpdateEndDate(e.target.value)}
                        />
                    )}
                    <FormControlLabel
                        control={<Checkbox checked={updateIsAllDayChecked} onChange={handleUpdateAllDayCheckboxChange} />}
                        label="All Day?"
                    />
                    {!updateIsAllDayChecked && (
                        <div>
                            <FormControl fullWidth>
                                <InputLabel id="start-time-label">Start Time</InputLabel>
                                <Select
                                    labelId="start-time-label"
                                    id="start-time-select"
                                    value={updateStartTime}
                                    onChange={(e) => setUpdateStartTime(e.target.value)}
                                    label="Start Time"
                                    sx={{ fontSize: '0.875rem' , width: '200px'}} 
                                    
                                >
                                    {timeSlots.map(slot => (
                                        <MenuItem key={slot.militaryTime} value={slot.militaryTime}sx={{ fontSize: '0.875rem' }}>{slot.timeLabel} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="end-time-label">End Time</InputLabel>
                                <Select
                                    labelId="end-time-label"
                                    id="end-time-select"
                                    value={updateEndTime}
                                    onChange={(e) => setUpdateEndTime(e.target.value)}
                                    label="End Time"
                                    sx={{ fontSize: '0.875rem' , width: '200px'}} 
                                >
                                    {timeSlots.map(slot => (
                                        <MenuItem key={slot.militaryTime} value={slot.militaryTime} >{slot.timeLabel} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewEditEventDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {editEvent(); closeEditEvent()}} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

    {/* TITLE */}
            <h1 style={{marginLeft: '10px' ,font:'Georgia'}}>Calendar</h1>


    {/* THIS IS THE ENTERING A NEW EVENT TO ADD TO THE CALENDAR */}
            <Button className="enterEventButton"
                variant="contained" 
                style={{ backgroundColor: '#476730', color: 'white' , marginLeft: '10px'}}
                
                onClick={() => {
                    resetFormFields(); // Reset form fields if needed
                    setViewMakeDialogOpen(true); // Correctly open the dialog for entering a new event
                }}  
                id='EventButtonClick'
            >
                Enter A New Event
            </Button>

            <Dialog open={viewMakeDialogOpen} onClose={() => setViewMakeDialogOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Enter an Event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details of the event.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Event Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={event}
                        onChange={(e) => setEvent(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={isDifferentDayChecked} onChange={handleDifferentDayCheckboxChange} />}
                        label="End Date is Different?"
                    />
                    {isDifferentDayChecked && (
                        <TextField
                            margin="dense"
                            id="endDate"
                            label="End Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    )}
                    <FormControlLabel
                        control={<Checkbox checked={isAllDayChecked} onChange={handleAllDayCheckboxChange} />}
                        label="All Day?"
                    />
                    {!isAllDayChecked && (
                        <div>
                            <FormControl fullWidth>
                                <InputLabel id="start-time-label">Start Time</InputLabel>
                                <Select
                                    labelId="start-time-label"
                                    id="start-time-select"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    label="Start Time"
                                    sx={{ fontSize: '0.875rem' , width: '200px'}} 
                                    
                                >
                                    {timeSlots.map(slot => (
                                        <MenuItem key={slot.militaryTime} value={slot.militaryTime}sx={{ fontSize: '0.875rem' }}>{slot.timeLabel} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="end-time-label">End Time</InputLabel>
                                <Select
                                    labelId="end-time-label"
                                    id="end-time-select"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    label="End Time"
                                    sx={{ fontSize: '0.875rem' , width: '200px'}} 
                                >
                                    {timeSlots.map(slot => (
                                        <MenuItem key={slot.militaryTime} value={slot.militaryTime} >{slot.timeLabel} </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewMakeDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>



            <div className='calendarcomponent'>
            <FullCalendarComponent
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                displayEventTime = {true}
                displayEventEnd = {true}
                themeSystem='standard'
                eventClick = {(info) => handleEventClick(info)}
                headerToolbar={{
                    start: '',
                    center: 'title',
                }}
                eventColor='#5ab350'
                events={allData}
                selectable = {true}

            />
            </div>
     
        </div>
    );
};