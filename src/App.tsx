import React from 'react';
import {useSelector,useDispatch} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actionCreators from '@actions/actionCreators'
import { Report, State } from '@reducers/patientReducer';
import type {RootState, AppDispatch} from '@redux/store'

function App() {
  const phoneNum: string = useSelector((state: RootState) => state.patient.phoneNum);
  const dispatch:AppDispatch = useDispatch()

  const AC = bindActionCreators(actionCreators, dispatch);
  const {addReport} = AC
  
  const handleClick = () => {
    const reportObj:Report = {
      fileUrls: ["https://unsplash.it/800", "https://unsplash.it/801"],
      date: new Date(),
      tag: "Prescription",
      phoneNumber: phoneNum
    }
    addReport(reportObj);
  }

  return (
      <div className="App">
        <button onClick={handleClick} >Add Report</button>
      </div>
  );
}

export default App;
