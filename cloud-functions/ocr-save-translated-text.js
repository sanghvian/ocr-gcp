/**
 * This function is exported by index.js, and is executed when
 * a message is published to the Cloud Pub/Sub topic specified
 * by the RESULT_TOPIC environment variable. The function saves
 * the data packet to a file in GCS.
 *
 * @param {object} event The Cloud Pub/Sub Message object.
 * @param {string} {messageObject}.data The "data" property of the Cloud Pub/Sub
 * Message. This property will be a base64-encoded string that you must decode.
 */
 const {Storage} = require('@google-cloud/storage');

const renameImageForSave = (filename, lang) => {
  return `${filename}_to_${lang}.txt`;
};


  // Get a reference to the Cloud Storage component

  const storage = new Storage();

exports.saveResult = async event => {
  const pubsubData = event.data;
  const jsonStr = Buffer.from(pubsubData, 'base64').toString();
  const {text, filename, lang} = JSON.parse(jsonStr);

  if (!text) {
    throw new Error(
      'Text not provided. Make sure you have a "text" property in your request'
    );
  }
  if (!filename) {
    throw new Error(
      'Filename not provided. Make sure you have a "filename" property in your request'
    );
  }
  if (!lang) {
    throw new Error(
      'Language not provided. Make sure you have a "lang" property in your request'
    );
  }

  console.log(`Received request to save file ${filename}`);

  const bucketName = process.env.RESULT_BUCKET;
  const newFilename = renameImageForSave(filename, lang);
  const file = storage.bucket(bucketName).file(newFilename);

  console.log(`Saving result to ${newFilename} in bucket ${bucketName}`);

  await file.save(text);
  console.log('File saved.');
};