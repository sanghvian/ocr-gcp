import * as actions from '@actions/actionTypes'

interface Report {
    fileUrls: string[],
    phoneNumber?: string, // to link a report to a unique patient
    date: Date,
    uuid?: string,
    tag: string,
}

enum Mode {
    VIEW_REPORT = "view-report",
    UPLOAD_REPORT = "upload-report",
    VIEW_REPORTS = "view-reports"
}

interface State{
    patientName: string, // phone number will be uuid
    phoneNum: string,
    reports: Report[],
    mode:Mode
}

const initialState: State = {
    mode: Mode.VIEW_REPORTS,
    patientName: "Sam Altman",
    phoneNum: '9820178330',
    reports : []
}

const patientReducer = (state:State = initialState, action:any) => {
    switch (action.type) {
        case actions.ADDING_REPORT:
            console.log('report is being uploaded')
            return {
                ...state
            }
        default:
            console.log('default case triggered')
            return {...state};
    }
}

export default patientReducer