import { useState } from 'react';
import { Fab } from '@mui/material';
// import {AddIcon} from '@mui/icons-material';
import UploadModal from './UploadModal';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import '../src/assets/css/styles.css'

let theme = createTheme({
  palette: {
    primary: {
      main: '#1BB4A4',
    },
    secondary: {
      main: '#F5F9F9',
    },
  },
});

export interface DisplayDataI {
  url: string,
  name: string,
  gender: string,
  contactNumber: string,
  aadharNumber:string
}

export default function App() {
  const [data, setData] = useState<DisplayDataI[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  
  const handleAdd = (e:any) => {
    e.stopPropagation()
    e.preventDefault();
    setOpenModal(true)
  }

  const addData = (info:DisplayDataI) => {
    return setData((data:DisplayDataI[])=> [...data, info] )
  }

  return (
    <ThemeProvider theme={theme}>
      <Fab variant="extended" onClick={(e:any)=>handleAdd(e)} color="primary" aria-label="add">
        + Add new document
      </Fab>
      <UploadModal open={openModal} addData={addData} setOpenModal={setOpenModal} />
    </ThemeProvider>
  )
}