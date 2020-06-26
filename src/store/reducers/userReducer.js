import {LOGIN_USER, LOGOUT_USER} from "../actions/actionTypes";

const initialState = {
    token: null,
    email: null,
    id: null
};

export  function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload;
        case LOGOUT_USER:
            return {...initialState};
        default:
            return state
    }
}