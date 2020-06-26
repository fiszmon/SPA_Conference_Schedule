import {SELECT_DAY} from "./actionTypes";

export function selectDayFactory(day) {
    return {
        type: SELECT_DAY,
        payload: {day}
    }
}