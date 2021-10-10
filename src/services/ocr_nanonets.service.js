import base64 from 'react-native-base64';

export const ocrService = {
  ocr_predict_id_card,
};

const nanonets_api_url =
  'https://app.nanonets.com/api/v2/OCR/Model/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/LabelFile/';
const username = '1myD4Y8iM8C4snbiJU4W0-2WvmtFFMkg';
const password = '';
const auth = 'Basic ' + base64.encode(username + ':' + password);

async function ocr_predict_id_card(picture_uri) {
  const formData = new FormData();

  formData.append('file', {
    uri: picture_uri,
    type: 'image/jpeg',
    name: 'file',
  });

  let response = await fetch(nanonets_api_url, {
    method: 'POST',
    headers: {
      Authorization: auth,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
