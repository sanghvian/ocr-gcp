// [START functions_ocr_setup]
// Get a reference to the Pub/Sub component
const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();

// Get a reference to the Cloud Vision API component
const Vision = require('@google-cloud/vision');
const vision = new Vision.ImageAnnotatorClient();

// Get a reference to the Translate API component
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

// [END functions_ocr_setup]

/**
 * Publishes the result to the given pubsub topic and returns a Promise.
 *
 * @param {string} topicName Name of the topic on which to publish.
 * @param {object} data The message data to publish.
 */
const publishResult = async (topicName, data) => {
  const dataBuffer = Buffer.from(JSON.stringify(data));

  const [topic] = await pubsub.topic(topicName).get({autoCreate: true});
  topic.publish(dataBuffer);
};

// [START functions_ocr_detect]
/**
 * Detects the text in an image using the Google Vision API.
 *
 * @param {string} bucketName Cloud Storage bucket name.
 * @param {string} filename Cloud Storage file name.
 * @returns {Promise}
 */
exports.processImage = async event => {
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
  const topicName = process.env.TRANSLATE_TOPIC;

  const tasks = TO_LANGS.map(lang => {
    const messageData = {
      text: text,
      filename: filename,
      lang: lang,
    };

    // Helper function that publishes translation result to a Pub/Sub topic
    // For more information on publishing Pub/Sub messages, see this page:
    //   https://cloud.google.com/pubsub/docs/publisher
    return publishResult(topicName, messageData);
  });

  return Promise.all(tasks);
};
// [END functions_ocr_detect]
