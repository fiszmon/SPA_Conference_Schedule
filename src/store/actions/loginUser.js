import {LOGIN_USER} from "./actionTypes";

export function loginUserFactory(id, token, email) {
    return {
        type: LOGIN_USER,
        payload: {
            id, token, email
        }
    }
}