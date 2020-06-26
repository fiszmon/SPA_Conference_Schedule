import {FETCH_PENDING, FETCH_PRESENTATIONS, FETCH_ERROR} from "./actionTypes";

export function fetchPending() {
    return {
        type: FETCH_PENDING
    }
}

export function fetchPresentations(data) {
    return {
        type: FETCH_PRESENTATIONS,
        payload: data
    }
}

export function fetchError(error) {
    return {
        type: FETCH_ERROR,
        payload: error
    }
}