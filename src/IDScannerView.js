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
  const selfieURI = route.params && route.params.selfieURI

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
        responseJson1 = await ( await fetch('https://app.nanonets.com/api/v2/OCR/Model/6ad46e83-fb6d-4bfc-8e6d-714d74a62c16/LabelFile/', {
          method: 'POST',
          headers: {
            'Authorization': auth
          },
          body: formData1
        })).json()

        const filePath = responseJson1.result[0].filepath
        // console.log('origiinal', responseJson1.signed_urls[filePath].original)

        if (responseJson1.result[0].prediction.length === 0) {
          console.log("Prediction failed")
        } else {
          console.log("Prediction success")
          setData(responseJson1.result)
          setStep(1)

          const cardImages = []

          cardImages.push(responseJson1.signed_urls[filePath].original)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_90)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_180)
          cardImages.push(responseJson1.signed_urls[filePath].acw_rotate_270)

          // compare faces
          if (selfieURI) {
            const formData2 = new FormData()
            formData1.append('selfie', {
              uri: selfieURI,
              type: 'image/jpeg',
              name: 'selfie'
            })
            cardImages.forEach((image, i) => {
              data.append("id_card[]", {
                uri: image,
                type: "image/jpeg",
                name: `id_card_${i}.jpg`,
              });
            });

            responseJson2 = await ( await fetch('http://3fb0-96-27-135-242.ngrok.io/api/v1/compare_faces', {
              method: 'POST',
              headers: {
                Accept: "application/x-www-form-urlencoded",
              },
              body: formData
            })).json()

            responseJson2.forEach((res, idx) => {
              if (res.result) {
                setFaceVerified(true)
              }
            })
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
          flashMode={RNCamera.Constants.FlashMode.on}
          mirrorImage={true}
          fixOrientation={true}
          onFocusChanged={() => {}}
          captureAudio={false}
          onZoomChanged={() => {}}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }
          style={styles.preview}
          type={RNCamera.Constants.Type.back}>
          <BarcodeMask
            backgroundColor="#ffffff"
            edgeColor="#7C7BC8"
            showAnimatedLine={false}
            outerMaskOpacity={0}
          />
          <Text style={styles.capture} onPress={takePicture}>[CAPTURE]</Text>
        </RNCamera>
      </SafeAreaView>
    )
  else if (step === 1) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>{data}</Text>
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
