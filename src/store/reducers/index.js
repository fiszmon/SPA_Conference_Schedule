import {combineReducers} from "redux";
import {userReducer} from "./userReducer";
import {presentationReducer} from "./presentationReducer";

const rootReducer = combineReducers({user: userReducer, presentation: presentationReducer});

export default rootReducer;
