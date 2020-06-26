import {ADD_REMINDER,DELETE_REMINDER} from "./actionTypes";

export function addReminderFactory(presentationId, reminder) {
    return {
        type: ADD_REMINDER,
        payload: {presentationId, reminder}
    }
}

export function deleteReminderFactory(presentationId) {
    return {
        type: DELETE_REMINDER,
        payload: {presentationId}
    }
}