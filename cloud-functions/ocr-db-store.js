/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */

 exports.dbStore = async event => {
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
  
    console.log(text)
  };
  // [END functions_ocr_translate]