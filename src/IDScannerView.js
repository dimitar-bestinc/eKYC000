import React, {useState, useContext} from 'react';
import {Dimensions, Text} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {VerificationContext} from './context/VerificationContext';
import {useNavigation} from '@react-navigation/native';

const {width: windowWidth} = Dimensions.get('window');
const NANONETS_URL =
  'https://app.nanonets.com/api/v2/OCR/Model/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/LabelFile/';
const FAKE_NANONETS_RESPONSE = {
  message: 'Success',
  result: [
    {
      message: 'Success',
      input: 'illinois.jpg',
      prediction: [
        {
          id: '',
          label: 'State',
          xmin: 44,
          ymin: 462,
          xmax: 78,
          ymax: 638,
          score: 1,
          ocr_text: 'SIONITII',
        },
        {
          id: '',
          label: 'DOB',
          xmin: 145,
          ymin: 274,
          xmax: 167,
          ymax: 392,
          score: 1,
          ocr_text: '11/14/1987',
        },
        {
          id: '',
          label: 'Address',
          xmin: 238,
          ymin: 219,
          xmax: 271,
          ymax: 432,
          score: 0.99999315,
          ocr_text: '1234 MAIN STREET\nSPRINGFIELD, IL 62723',
        },
        {
          id: '',
          label: 'Address',
          xmin: 357,
          ymin: 275,
          xmax: 369,
          ymax: 321,
          score: 0.8891924,
          ocr_text: '16HGT:',
        },
        {
          id: '',
          label: 'Class',
          xmin: 293,
          ymin: 365,
          xmax: 306,
          ymax: 376,
          score: 1,
          ocr_text: 'D',
        },
        {
          id: '',
          label: 'Sex',
          xmin: 353,
          ymin: 384,
          xmax: 367,
          ymax: 393,
          score: 1,
          ocr_text: 'F',
        },
        {
          id: '',
          label: 'Eye_Color',
          xmin: 374,
          ymin: 222,
          xmax: 388,
          ymax: 260,
          score: 1,
          ocr_text: 'BRN',
        },
        {
          id: '',
          label: 'License_No',
          xmin: 115,
          ymin: 193,
          xmax: 140,
          ymax: 375,
          score: 1,
          ocr_text: 'P142-4558-7924',
        },
        {
          id: '',
          label: 'Name',
          xmin: 197,
          ymin: 354,
          xmax: 235,
          ymax: 433,
          score: 0.98975706,
          ocr_text: 'PUBLIC\nJANE Q',
        },
        {
          id: '',
          label: 'Issue_Date',
          xmin: 171,
          ymin: 49,
          xmax: 190,
          ymax: 156,
          score: 0.9998381,
          ocr_text: '01/01/2019',
        },
        {
          id: '',
          label: 'Weight',
          xmin: 374,
          ymin: 331,
          xmax: 388,
          ymax: 393,
          score: 1,
          ocr_text: '145 IbS',
        },
        {
          id: '',
          label: 'Height',
          xmin: 353,
          ymin: 211,
          xmax: 369,
          ymax: 261,
          score: 0.9998926,
          ocr_text: '5\'-06"',
        },
      ],
      page: 0,
      request_file_id: '7c4be74b-610d-47e3-b100-acd0e30e5642',
      filepath:
        'uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg',
      id: 'b7eaf32e-1fb3-11ec-97f7-a28fee8f8a83',
      rotation: 270,
    },
  ],
  signed_urls: {
    'uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg':
      {
        original:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?expires=1632776134&or=0&s=e0820d54a4624e237b212ee451e6aa89',
        original_compressed:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=0&s=6b7299cc041a02599bd59b450e700508',
        thumbnail:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&w=240&s=b09931433d62d188db4957a63d2a857b',
        acw_rotate_90:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=270&s=ead20e0116b2e520721629d8f3e79a80',
        acw_rotate_180:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=180&s=12a8047e1f6ade834fdf56ee3f710a49',
        acw_rotate_270:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=90&s=58fcd5d6cd44800bf0708796d297506e',
        original_with_long_expiry:
          'https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?expires=1648313734&or=0&s=9eec2a6594c2a2163e06c349516b9352',
      },
  },
};

const IDScannerView = () => {
  const navigation = useNavigation();
  const [Verification, setVerification] = useContext(VerificationContext);
  // let selfieURI = route.params && route.params.selfieURI

  // const [data, setData] = useState(null)
  // const [faceVerified, setFaceVerified] = useState(false)
  // const [step, setStep] = useState(0)
  // const [frontIdPicture, setFrontIdPicture] = useState(null)
  // const [frontIdOCR, setFrontIdOCR] = useState(null)
  // const cameraRef = useRef()
  const [camera, setCamera] = useState({
    type: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.auto,
  });

  const takePicture = async () => {
    console.log('Takep picture');
    if (this.camera) {
      console.log('Camera detected');
      const options = {
        fixOrientation: true,
        forceUpOrientation: true,
        base64: true,
        quality: 1,
        exif: true,
        orientation: RNCamera.Constants.ORIENTATION_UP,
      };

      try {
        const picture = await this.camera.takePictureAsync(options);
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            currentStep: 3,
            frontIdPicture: picture,
          };
        });
      } catch (e) {
        console.log(e);
      } finally {
        navigation.navigate('ProgressPage');
      }
    }
  };

  // const detectOCR = (picture) => {
  //   const username = '1myD4Y8iM8C4snbiJU4W0-2WvmtFFMkg'
  //   const password = ''
  //   const auth = 'Basic ' + base64.encode(username + ":" + password)
  //   const formData = new FormData()

  //   formData.append('file', {
  //     uri: picture.uri,
  //     type: 'image/jpeg',
  //     name: 'picture'
  //   })

  //   try {
  //     // const response = await ( await fetch(NANONETS_URL,
  //     //   {
  //     //     method: 'POST',
  //     //     headers: {
  //     //       'Authorization': auth
  //     //     },
  //     //     body: formData1
  //     //   })).json()
  //   } catch (error) {

  //   }

  //   const response = FAKE_NANONETS_RESPONSE
  //   const { prediction } = response.result[0]
  //   if (prediction.length === 0) {
  //     console.log("process failed")
  //   } else {
  //     console.log("process success")
  //     setFrontIdOCR(prediction)
  //     setStep(1)
  //   }
  // }

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          textAlign: 'center',
          width: '80%',
          alignSelf: 'center',
          fontSize: 18,
          color: '#565656',
          fontFamily: 'Poppins-Regular',
          padding: 10,
        }}>
        Please scan the frontside of your ID.
      </Text>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        defaultTouchToFocus
        flashMode={RNCamera.Constants.FlashMode.auto}
        mirrorImage={false}
        fixOrientation={true}
        onFocusChanged={() => {}}
        captureAudio={false}
        onZoomChanged={() => {}}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}>
        <BarcodeMask
          backgroundColor="#ffffff"
          edgeColor="#7C7BC8"
          showAnimatedLine={false}
          outerMaskOpacity={0.8}
          width={windowWidth - 20}
          height={300}
        />
        <Text style={styles.capture} onPress={takePicture}>
          [CAPTURE]
        </Text>
      </RNCamera>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enterBarcodeManualButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  back: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    // width: 120,
    backgroundColor: 'tomato',
  },
};

export default IDScannerView;
