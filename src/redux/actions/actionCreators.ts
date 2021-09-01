import *as actions from './actionTypes'

export const addReport = (reportObj:any) => {
    return (dispatch:any) => dispatch({
        type: actions.ADDING_REPORT,
        payload:reportObj
    })
}