import {
    ADD_REMINDER, DELETE_REMINDER,
    FETCH_ERROR, FETCH_PENDING,
    FETCH_PRESENTATIONS,
    SELECT_DAY
} from "../actions/actionTypes";

const initialState = {
    days: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    selectedDay: "MONDAY",
    pending: false,
    presentations: [],
    rooms: {},
    sessions: [],
    reminders: [],
    error: null
};

export function presentationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_PENDING:
            return {...state, pending: true};
        case FETCH_PRESENTATIONS:
            const {rooms, sessions, presentations, schedules, reminders} = action.payload;
            return {
                ...state,
                pending: false,
                rooms,
                sessions,
                presentations,
                schedules,
                reminders
            };
        case FETCH_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        case SELECT_DAY:
            return {...state, selectedDay: action.payload.day};
        case ADD_REMINDER:
            return {...state,
                presentations: state.presentations.map(presentation => presentation.id === action.payload.presentationId?
                    {...presentation, reminder: action.payload.reminder}: presentation),
                reminders: [...state.reminders, action.payload.reminder]
            };
        case DELETE_REMINDER:
            return {...state, presentations: state.presentations.map(presentation => presentation.id === action.payload.presentationId?
                    {...presentation, reminder: null}: presentation),
                reminders: state.reminders.filter((i)=>i.presentationId !== action.payload.presentationId)
            };
        default:
            return state
    }
}