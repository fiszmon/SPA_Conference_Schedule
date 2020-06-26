import {LOGOUT_USER} from "./actionTypes";

export function logoutUserFactory() {
    return {
        type: LOGOUT_USER,
    }
}