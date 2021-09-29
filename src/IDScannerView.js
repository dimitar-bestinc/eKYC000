import React, {useRef, useState} from 'react'
import {
  Dimensions,
  Alert,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Button,
  StatusBar,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import {RNCamera} from 'react-native-camera'
import BarcodeMask from 'react-native-barcode-mask'
import base64 from 'react-native-base64'

const IDScannerView = ({ route, navigation }) => {
  let selfieURI = route.params && route.params.selfieURI

  const [data, setData] = useState(null)
  const [faceVerified, setFaceVerified] = useState(false)
  const [step, setStep] = useState(0)
  // const [picture, setPicture] = useState(null)

  const cameraRef = useRef()

  const [camera, setCamera] = useState({
    type: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.auto,
  })

  const takePicture = async () => {
    const options = {quality: 0.5, base64: true}
    const picture = await cameraRef.current.takePictureAsync(options)
    console.log(picture.uri)

    if (picture) {
      const username = '1myD4Y8iM8C4snbiJU4W0-2WvmtFFMkg'
      const password = ''
      const auth = 'Basic ' + base64.encode(username + ":" + password)
      const formData1 = new FormData()
      formData1.append('file', {
        uri: picture.uri,
        type: 'image/jpeg',
        name: 'picture'
      })
      try {
        // responseJson1 = await ( await fetch('https://app.nanonets.com/api/v2/OCR/Model/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/LabelFile/', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': auth
        //   },
        //   body: formData1
        // })).json()
        responseJson1 = {
          "message": "Success",
          "result": [
              {
                  "message": "Success",
                  "input": "illinois.jpg",
                  "prediction": [
                      {
                          "id": "",
                          "label": "State",
                          "xmin": 44,
                          "ymin": 462,
                          "xmax": 78,
                          "ymax": 638,
                          "score": 1,
                          "ocr_text": "SIONITII"
                      },
                      {
                          "id": "",
                          "label": "DOB",
                          "xmin": 145,
                          "ymin": 274,
                          "xmax": 167,
                          "ymax": 392,
                          "score": 1,
                          "ocr_text": "11/14/1987"
                      },
                      {
                          "id": "",
                          "label": "Address",
                          "xmin": 238,
                          "ymin": 219,
                          "xmax": 271,
                          "ymax": 432,
                          "score": 0.99999315,
                          "ocr_text": "1234 MAIN STREET\nSPRINGFIELD, IL 62723"
                      },
                      {
                          "id": "",
                          "label": "Address",
                          "xmin": 357,
                          "ymin": 275,
                          "xmax": 369,
                          "ymax": 321,
                          "score": 0.8891924,
                          "ocr_text": "16HGT:"
                      },
                      {
                          "id": "",
                          "label": "Class",
                          "xmin": 293,
                          "ymin": 365,
                          "xmax": 306,
                          "ymax": 376,
                          "score": 1,
                          "ocr_text": "D"
                      },
                      {
                          "id": "",
                          "label": "Sex",
                          "xmin": 353,
                          "ymin": 384,
                          "xmax": 367,
                          "ymax": 393,
                          "score": 1,
                          "ocr_text": "F"
                      },
                      {
                          "id": "",
                          "label": "Eye_Color",
                          "xmin": 374,
                          "ymin": 222,
                          "xmax": 388,
                          "ymax": 260,
                          "score": 1,
                          "ocr_text": "BRN"
                      },
                      {
                          "id": "",
                          "label": "License_No",
                          "xmin": 115,
                          "ymin": 193,
                          "xmax": 140,
                          "ymax": 375,
                          "score": 1,
                          "ocr_text": "P142-4558-7924"
                      },
                      {
                          "id": "",
                          "label": "Name",
                          "xmin": 197,
                          "ymin": 354,
                          "xmax": 235,
                          "ymax": 433,
                          "score": 0.98975706,
                          "ocr_text": "PUBLIC\nJANE Q"
                      },
                      {
                          "id": "",
                          "label": "Issue_Date",
                          "xmin": 171,
                          "ymin": 49,
                          "xmax": 190,
                          "ymax": 156,
                          "score": 0.9998381,
                          "ocr_text": "01/01/2019"
                      },
                      {
                          "id": "",
                          "label": "Weight",
                          "xmin": 374,
                          "ymin": 331,
                          "xmax": 388,
                          "ymax": 393,
                          "score": 1,
                          "ocr_text": "145 IbS"
                      },
                      {
                          "id": "",
                          "label": "Height",
                          "xmin": 353,
                          "ymin": 211,
                          "xmax": 369,
                          "ymax": 261,
                          "score": 0.9998926,
                          "ocr_text": "5'-06\""
                      }
                  ],
                  "page": 0,
                  "request_file_id": "7c4be74b-610d-47e3-b100-acd0e30e5642",
                  "filepath": "uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg",
                  "id": "b7eaf32e-1fb3-11ec-97f7-a28fee8f8a83",
                  "rotation": 270
              }
          ],
          "signed_urls": {
              "uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg": {
                  "original": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?expires=1632776134&or=0&s=e0820d54a4624e237b212ee451e6aa89",
                  "original_compressed": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=0&s=6b7299cc041a02599bd59b450e700508",
                  "thumbnail": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&w=240&s=b09931433d62d188db4957a63d2a857b",
                  "acw_rotate_90": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=270&s=ead20e0116b2e520721629d8f3e79a80",
                  "acw_rotate_180": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=180&s=12a8047e1f6ade834fdf56ee3f710a49",
                  "acw_rotate_270": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?auto=compress&expires=1632776134&or=90&s=58fcd5d6cd44800bf0708796d297506e",
                  "original_with_long_expiry": "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?expires=1648313734&or=0&s=9eec2a6594c2a2163e06c349516b9352"
              }
          }
        }
        const filePath = responseJson1.result[0].filepath
        // console.log('origiinal', responseJson1.signed_urls[filePath].original)

        if (responseJson1.result[0].prediction.length === 0) {
          console.log("Prediction failed")
        } else {
          console.log("Prediction success")
          console.log(responseJson1.result[0].prediction)
          setData(responseJson1.result[0].prediction)
          setStep(1)
          console.log("1")
          const cardImages = []
          console.log(responseJson1.signed_urls[filePath].original)
          cardImages.push(responseJson1.signed_urls[filePath].original)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_90)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_180)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_270)
          console.log("2")
          // compare faces
          selfieURI = "https://nnts.imgix.net/uploadedfiles/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/PredictionImages/738024316.jpeg?expires=1632776134&or=0&s=e0820d54a4624e237b212ee451e6aa89"
          if (selfieURI) {
            console.log("3")
            const formData2 = new FormData()
            formData2.append('selfie', {
              uri: selfieURI,
              type: 'image/jpeg',
              name: 'selfie'
            })
            formData2.append('id_card', {
              uri: selfieURI,
              type: 'image/jpeg',
              name: 'selfie'
            })
            // cardImages.forEach((image, i) => {
            //   formData2.append("id_card[]", {
            //     uri: image,
            //     type: "image/jpeg",
            //     name: `id_card_${i}.jpg`,
            //   });
            // });
            // console.log("4", formData2)
            // responseJson2 = await ( await fetch('http://3fb0-96-27-135-242.ngrok.io/api/v1/compare_faces', {
            //   method: 'POST',
            //   // headers: {
            //   //   Accept: "application/x-www-form-urlencoded",
            //   // },
            //   body: formData2
            // })).json()
            // console.log("5", responseJson2)
            // responseJson2.forEach((res, idx) => {
            //   if (res.result) {
            //     setFaceVerified(true)
            //   }
            // })
          } else {
            console.log('selfie not taken!')
          }
        }
      } catch(err) {
        console.log("error", err);
      }
    } else {
      console.log("Error taking picture")
    }
  }

  if (step === 0)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#fcfcfc" barStyle="dark-content" />

        <View style={{alignItems: 'center', backgroundColor: '#fcfcfc'}}>
          {/* <Image
            source={require('../../assets/img/zooyza_logo_outline-02.png')}
            style={{
              width: '50%',
              height: 50,
              resizeMode: 'contain',
            }}
          /> */}
        </View>
        <Text
          style={{
            textAlign: 'center',
            width: '80%',
            alignSelf: 'center',
            fontSize: 18,
            color: '#565656',
            fontFamily: 'Poppins-Regular',
          }}>
          Please scan the frontside of your ID.
        </Text>
        <RNCamera
          ref={cameraRef}
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
            outerMaskOpacity={0.5}
          />
          <Text style={styles.capture} onPress={takePicture}>[CAPTURE]</Text>
        </RNCamera>
      </SafeAreaView>
    )
  else if (step === 1) {
    console.log('stp 1 start now')
    return (
      <SafeAreaView style={{flex: 1}}>
        {
          data.length > 0 ?
            data.map((item, idx) => (<Text key={`ocr_text_` + idx}>{item.label + ` : ` + item.ocr_text}</Text>))
            :
            <Text>{`OCR failed`}</Text>    
        }
        <Text style={styles.capture} onPress={() => setStep(0)}>[Back To Camera]</Text>
      </SafeAreaView>
    )
  }
}

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
    margin: 40
  }
}

export default IDScannerView
