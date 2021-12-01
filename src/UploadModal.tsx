import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useState } from "react";
import { storage } from "./firebase";
import {ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { Modal } from '@mui/material';
import { DisplayDataI } from './App';
import useClickOutside from './hooks/useClickOutside';

interface ModalI{
    open: boolean,
    addData: (info: DisplayDataI) => void,
    setOpenModal:Dispatch<SetStateAction<boolean>>
}

const UploadModal: React.FC<ModalI> = ({ open, addData,setOpenModal }) => {
    const modalRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState<string>("")

    useClickOutside(modalRef, () => {
        if (open) setOpenModal(false)
    })

    const [file, setFile] = useState<any>(null);
  const [url, setURL] = useState("");

  function handleChange(e:any) {
    setFile(e.target.files[0]);
  }

  function handleUpload(e:any) {
    e.preventDefault();
    const imRef = ref(storage,`/OCR-Doc/${file?.name}`);
    const uploadTask = uploadBytesResumable(imRef, file);
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setURL(downloadURL)
        });
      }
      );
      addData(
        {
            aadharNumber: "",
            contactNumber: "",
            name: "",
            gender: "",
            url
        }
      )
      setOpenModal(false)
  }

  return (
    <>
    <Modal
        open={open}
        
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <div className="upload-modal-child">
            <div className="close-button">x</div>
            <form onSubmit={handleUpload}>
                <label htmlFor="inp-file">Your image here</label>
                <input type="file" id="inp-file" onChange={handleChange} />
                <button disabled={!file}>Upload</button>
                {previewUrl && <img  src={previewUrl} alt ="uploaded image"/>}
            </form>
        </div>
    </Modal>
    </>
  );
}

export default UploadModal
