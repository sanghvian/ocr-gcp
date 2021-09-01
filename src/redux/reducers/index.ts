import { combineReducers } from 'redux'
import patientReducer from './patientReducer'

const reducers = combineReducers({
    patient: patientReducer,
})

export default reducers;