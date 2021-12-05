/**
 * This function is exported by index.js, and is executed when
 * a message is published to the Cloud Pub/Sub topic specified
 * by the TRANSLATE_TOPIC environment variable. The function
 * translates text using the Google Translate API.
 *
 * @param {object} event The Cloud Pub/Sub Message object.
 * @param {string} {messageObject}.data The "data" property of the Cloud Pub/Sub
 * Message. This property will be a base64-encoded string that you must decode.
 */

// Get a reference to the Pub/Sub component
const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub({projectId:"hackathon-ocr-52d8c"});

// Get a reference to the Translate API component
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

const publishResult = async (topicName, data) => {
  const dataBuffer = Buffer.from(JSON.stringify(data));

  const [topic] = await pubsub.topic(topicName).get({autoCreate: true});
  topic.publish(dataBuffer);
};

exports.translateText = async event => {
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

  console.log(`Translating text into ${lang}`);
  const [translation] = await translate.translate(text, lang);

  console.log('Translated text:', translation);

  const messageData = {
    text: translation,
    filename: filename,
    lang: lang,
  };

  await publishResult(process.env.RESULT_TOPIC, messageData);
  await publishResult(process.env.DB_STORE_TOPIC, messageData);
  console.log(`Text translated to ${lang}`);
};
// [END functions_ocr_translate]