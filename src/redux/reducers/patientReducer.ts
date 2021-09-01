import * as actions from '@actions/actionTypes'

interface Report {
    fileUrl: string,
    phoneNume: string,
    date: Date,
    uuid?:string
}


interface State{
    patientName: string,
    phoneNum: string,
    reports:Report []
}

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