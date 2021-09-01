import * as actions from '@actions/actionTypes'
import { defaultCipherList } from 'constants'
const initialState = {}

const patientReducer = (state:any, action:any) => {
    switch (action.type) {
        case actions.ADDING_REPORT:
            console.log('report is being uploaded')
            return {
                ...state
            }
        default:
            console.log('default case triggered')
    }
}

export default patientReducer