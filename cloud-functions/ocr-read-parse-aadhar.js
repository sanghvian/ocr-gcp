// [START functions_ocr_setup]
// Get a reference to the Pub/Sub component

// Import the functions you need from the SDKs you need
const {initializeApp  } = require("firebase/app");
const { addDoc, getFirestore,collection} = require('@firebase/firestore')
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
const db = getFirestore(app);

// Get a reference to the Cloud Vision API component
const Vision = require('@google-cloud/vision');
const vision = new Vision.ImageAnnotatorClient();

// Get a reference to the Translate API component
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();


/**
 * 
 * Detects the text in an image using the Google Vision API.
 *
 * @param {string} bucketName Cloud Storage bucket name.
 * @param {string} filename Cloud Storage file name.
 * @returns {Promise}
 */
exports.processOCR = async event => {
  const {bucket, name} = event;

  if (!bucket) {
    throw new Error(
      'Bucket not provided. Make sure you have a "bucket" property in your request'
    );
  }
  if (!name) {
    throw new Error(
      'Filename not provided. Make sure you have a "name" property in your request'
    );
  }

  await detectText(bucket, name);
  console.log(`File ${name} processed.`);
};
// [END functions_ocr_process]

const detectText = async (bucketName, filename) => {
  console.log(`Looking for text in image ${filename}`);
  const [textDetections] = await vision.textDetection(
    `gs://${bucketName}/${filename}`
  );
  const [annotation] = textDetections.textAnnotations;
  const text = annotation ? annotation.description : '';
  console.log('Extracted text from image:', text);

  let [translateDetection] = await translate.detect(text);
  if (Array.isArray(translateDetection)) {
    [translateDetection] = translateDetection;
  }
  console.log(
    `Detected language "${translateDetection.language}" for ${filename}`
  );

  // Submit a message to the bus for each language we're going to translate to
  const TO_LANGS = process.env.TO_LANG.split(',');

  const tasks = TO_LANGS.map(async(lang) => {
    const messageData = {
      text: text,
      filename: filename,
      lang: lang,
    };

    // Helper function that publishes translation result to a Pub/Sub topic
    // For more information on publishing Pub/Sub messages, see this page:
    //   https://cloud.google.com/pubsub/docs/publisher
    try{
      let detail=messageData.text
      // get gender
      let gender=""
      if(detail.indexOf('male')!== -1 || 
      detail.indexOf('Male')!== -1 ||
      detail.indexOf('MALE')!== -1){
          gender="male"
      }else if(detail.indexOf('female')!== -1 || 
      detail.indexOf('Female')!== -1 ||
      detail.indexOf('FEMALE')!== -1){
          gender="female"
      }

      // get aadhar card number 
      let number = detail.match(/[\+]?\d{10}|\(\d{3}\)\s?-\d{6}/);
      var aadharnumber = detail.match(/[0-9]\d{3}[\s-]?\d{4}[\s-]?\d{4}/g);
      var dob = detail.match(/([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/);  
      let uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        let data={
          id:uniqueId,
          name:"dummy",
          gender:gender,
          dob: dob+"",
          address:"",
          number:aadharnumber,
          mobile:number,
          image:messageData.filename,
          lang:lang,
          data:detail,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        addDetailsMethod(data)
    }catch(e){
      console.log(e)
    }
  });

  return Promise.all(tasks);
};
// [END functions_ocr_detect]

const addDetailsMethod = async (data) => {
      try {
         await addDoc(collection(db, "ocr-reader"),data);
      } catch (e) {
        console.log("Error while fetching user policy details", e);
        return {status: 500, error: "Internal Server Error"};
      }
};