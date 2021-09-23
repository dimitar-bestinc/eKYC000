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

const IDScannerView = props => {
  const [data, setData] = useState('')
  const [step, setStep] = useState(0)

  const cameraRef = useRef()

  const [camera, setCamera] = useState({
    type: RNCamera.Constants.Type.back,
    flashMode: RNCamera.Constants.FlashMode.auto,
  })

  const onBarCodeRead = scanResult => {
    console.log(scanResult.type)
    console.log(scanResult.data)
    if (scanResult.type === 'org.iso.PDF417' || scanResult.type === 'PDF_417') {
      if (scanResult.data != null) {
        if (!data.includes(scanResult.data)) {
          //data.push(scanResult.data)
          setData(scanResult.data)
          setStep(1)
          console.log('onBarCodeRead call')
        }
      }
      return
    }
    return
  }

  const takePicture = async () => {
    const options = {quality: 0.5, base64: true}
    const data = await cameraRef.current.takePictureAsync(options)
    console.log(data.uri)
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
          mirrorImage={true}
          onBarCodeRead={value => onBarCodeRead(value)}
          onFocusChanged={() => {}}
          captureAudio={false}
          onZoomChanged={() => {}}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }
          style={styles.preview}
          type={RNCamera.Constants.Type.front}>
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
