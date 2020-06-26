import axios from "axios";
import {format, getDay} from 'date-fns';
import {fetchError, fetchPending, fetchPresentations} from "../store/actions/fetchAction";

//     {
//
//
//     rooms: {
//         A: {
//             id: "A",
//             name: "Room A",
//             lat: 0,
//             lng: 0
//         }
//     },
//     sessions: [
//         PS: {
//             name: "Plenary Session",
//             room: "A",
//             color: "#444444"
//         },
//     ],
//     presentations: [
//         {
//             "id": "5e80cd1cade42ed51731e71e",
//             "date": "2020-03-24",
//             "keywords": [
//                 "exercitation",
//                 "id",
//                 "ad",
//                 "velit",
//                 "aute"
//             ],
//             "authors": [
//                 "Frieda Kirk",
//                 "Acosta Little",
//                 "Fitzpatrick Duffy"
//             ],
//             "title": "voluptate deserunt proident",
//             "filename": null,
//             "session": "PS",
//             "day": "THURSDAY"
//             "time": "9:00"
//         },

export const SessionsColors = {
    "PLENARY": "#292dff",
    "COMMERCIAL_PLENARY": "#2f0d79",
    "FSIP": "#32661e",
    "STM": "#881e1a",
    "CMD": "#9e7631",
    "SWP": "#29735f",
    "NTSM": "#824697",
    "PHD": "#db7980",
    "CSM": "#cb2841",
    "POSTER": "#eb00ff",
    "CTS": "#ff8500",
    "ANM": "#ff007e",
    "BIO": "#009b87",
    "MICRO": "#8f00ff",
    "CFD": "#5bfaff",
    "OPT": "#ff1a02"};

export function fetchPresentationsService(dispatch, days, token) {
    const schedulesPromise = axios.get('https://ie2020.kisim.eu.org/api/schedules');
    const roomsPromise = axios.get('https://ie2020.kisim.eu.org/api/rooms');
    const sessionsPromise = axios.get('https://ie2020.kisim.eu.org/api/sessions');
    const presentationsPromise = axios.get('https://ie2020.kisim.eu.org/api/presentations');
    const remindersPromise = axios.get('https://ie2020.kisim.eu.org/api/reminders', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    dispatch(fetchPending());
    Promise.all([schedulesPromise, roomsPromise, sessionsPromise, presentationsPromise, remindersPromise]).then(([schedules, rooms, sessions, presentations,reminders]) => {
        const responseData = {
            schedules: schedules.data,
            sessions: mapSessions(sessions.data),
            rooms: mapRooms(rooms.data),
            presentations: mapPresentations(days, presentations.data, reminders.data),
            reminders: reminders.data,
        };
        console.log(responseData);
        dispatch(fetchPresentations(responseData));
    }).catch(error => dispatch(fetchError(error)));
}

function mapPresentations(days, presentations, reminders) {
    return presentations.map(({date, ...item}) => ({
        ...item,
        time: format(new Date(date), 'HH:mm'),
        day: days[getDay(new Date(date))-1],
        reminder: reminders.find(({presentationId}) => item.id === presentationId)
    }))
}

function mapRooms(rooms) {
    return Object.entries(rooms).map(([id, item]) => (
        {
            ...item,
            id
        }
    )).reduce((acc, room) => ({...acc, [room.id]: room}), {})
}

function mapSessions(sessions) {
    return Object.entries(sessions).map(([id, {localization, ...item}]) => (
        {
            ...item,
            id,
            room: localization,
            color: SessionsColors[id] || "#444444"
        }
    )).reduce((acc, session) => ({...acc, [session.id]: session}), {})
}