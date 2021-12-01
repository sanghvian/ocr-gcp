// Import the functions you need from the SDKs you need
import {initializeApp  } from "firebase/app";
import {getStorage, ref} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBC51FrewJjKCmo62fZ8kpmVSf1HFfv2U4",
  authDomain: "hackathon-ocr-52d8c.firebaseapp.com",
  projectId: "hackathon-ocr-52d8c",
  storageBucket: "hackathon-ocr-52d8c.appspot.com",
  messagingSenderId: "562292920574",
  appId: "1:562292920574:web:3150d473c13e90da49d5af"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

export  {
  storage
}