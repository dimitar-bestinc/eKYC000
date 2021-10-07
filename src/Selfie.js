import React from 'react';
import { useEffect, useReducer, useRef, useState, useContext } from "react"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Alert,
  Image,
  Button,
  Modal,
  Pressable,
  TouchableHighlight
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { RNCamera, FaceDetector } from 'react-native-camera';
import { AnimatedCircularProgress } from "react-native-circular-progress"
import Svg, { Path, SvgProps, Defs, Mask, Rect, Circle } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { VerificationContext } from './context/VerificationContext'

const { width: windowWidth } = Dimensions.get("window")

const CircleMask = () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Circle r="35%" cx="50%" cy="35%" fill="black"/>
        </Mask>
      </Defs>
      <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.8)" mask="url(#mask)" fill-opacity="0" />
    </Svg>
  );
};

const Selfie = () => {
  const navigation = useNavigation()
  const [Verification, setVerification] = useContext(VerificationContext)
  const { selfie, currentStep } = Verification
  console.log("Verification Selfie", currentStep)

  const takePicture = async () => {
    console.log("Button CLicked")
    if (this.camera) {
      console.log("Camera detected")
      const options = {
        fixOrientation: true,
        forceUpOrientation: true,
        base64: true,
        quality: 1,
        exif: true,
        orientation: RNCamera.Constants.ORIENTATION_UP,
      }

      try {
        const data = await this.camera.takePictureAsync(options)
        setVerification((prevVerification) => {
          return {
            ...prevVerification,
            currentStep: 1,
            selfie: data
          }
        })
      } catch (e) {
        console.log(e)
      } finally {
        navigation.navigate("ProgressPage")
      }

    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.cameraPreview}
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
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.auto}
        captureAudio={false}
      >
        <CircleMask />
      </RNCamera>
      <TouchableHighlight 
        style={styles.actionButton}
        onPress={takePicture}
      >
        <Text>Snap</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  cameraPreview: {
    flex: 1
  },
  actionButton: {
    position: 'absolute',
    bottom: 30,
    padding: 20,
    right: 20,
    left: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'blue',
    flex: 1,
  },
});

export default Selfie;
