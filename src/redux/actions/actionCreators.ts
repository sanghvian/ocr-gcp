import *as actions from './actionTypes'
import {Report} from '@reducers/patientReducer'

export const addReport = (reportObj:Report) => {
    return (dispatch:any) => dispatch({
        type: actions.ADDING_REPORT,
        payload: reportObj,
    })
}