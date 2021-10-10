export const faceRecognitionService = {
  detect_faces,
  compare_faces,
};

const face_recognition_api_url =
  'http://d745-96-27-135-242.ngrok.io/api/v1/detect_faces/';

async function detect_faces(picture_uri) {
  const formData = new FormData();

  formData.append('faces', {
    uri: picture_uri,
    type: 'image/jpeg',
    name: 'picture',
  });

  let response = await fetch(face_recognition_api_url + 'detect_faces', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function compare_faces(selfie_uri, id_card_uri) {
  const formData = new FormData();

  formData.append('selfie', {
    uri: selfie_uri,
    type: 'image/jpeg',
    name: 'selfie',
  });

  formData.append('id_card', {
    uri: id_card_uri,
    type: 'image/jpeg',
    name: 'id_card',
  });

  let response = await fetch(face_recognition_api_url + 'compare_faces', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
