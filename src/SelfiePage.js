import React, {useRef} from 'react';
import {useContext, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Svg, {Defs, Mask, Rect, Circle} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';

import {VerificationContext} from './context/VerificationContext';
import {faceRecognitionService} from './services/face_recognition.service';

const CircleMask = () => {
  return (
    <Svg height="100%" width="100%">
      <Defs>
        <Mask id="mask" x="0" y="0" height="100%" width="100%">
          <Rect height="100%" width="100%" fill="#fff" />
          <Circle r="35%" cx="50%" cy="35%" fill="black" />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.8)"
        mask="url(#mask)"
        fill-opacity="0"
      />
    </Svg>
  );
};

const SelfiePage = () => {
  const navigation = useNavigation();
  const [, setVerification] = useContext(VerificationContext);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      console.log('Take picture');
      const options = {
        fixOrientation: true,
        forceUpOrientation: true,
        base64: true,
        quality: 1,
        exif: true,
        orientation: RNCamera.Constants.ORIENTATION_UP,
      };

      return await cameraRef.current.takePictureAsync(options);
    }
  };

  const checkSelfie = async () => {
    try {
      const data = await takePicture();
      console.log('picture taken success', data.uri);
      setVerification(prevVerification => {
        return {
          ...prevVerification,
          currentStep: 1,
          selfie: data,
          selfieVerified: false,
        };
      });
      setIsLoading(true);
      console.log('before calling detect faces');
      const json = await faceRecognitionService.detect_faces(data.uri);
      console.log('success detecting faces', json);
      console.log('json[0].coordinates', json[0].coordinates);
      if (json.length > 0 && json[0].coordinates.length > 0) {
        console.log('face detected');
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            selfieVerified: true,
          };
        });
        setIsLoading(false);
        navigation.navigate('LivenessPage');
        // setVerification(prevVerification => {
        //   return {
        //     ...prevVerification,
        //     currentStep: 2,
        //     selfieVerified: true,
        //   };
        // });
        // setIsLoading(false);
        // navigation.navigate('ProgressPage');
      } else {
        console.log('face not detected');
        setIsLoading(false);
        navigation.navigate('ProgressPage');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error: calling detect faces api', error);
      navigation.navigate('ProgressPage');
    }
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={styles.container}>
          <RNCamera
            ref={cameraRef}
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
            captureAudio={false}>
            <CircleMask />
            <Text style={styles.actionButton} onPress={checkSelfie}>
              [CAPTURE]
            </Text>
          </RNCamera>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    position: 'absolute',
    bottom: 50,
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelfiePage;
