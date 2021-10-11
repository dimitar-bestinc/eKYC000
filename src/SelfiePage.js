import React, {useRef} from 'react';
import {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

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
  const [Verification, setVerification] = useContext(VerificationContext);
  const {currentStep} = Verification;
  const [isLoading, setIsLoading] = useState(false);
  console.log('Verification Selfie', currentStep);
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

  const checkSelfie = () => {
    takePicture()
      .then(data => {
        setIsLoading(true);
        return faceRecognitionService
          .detect_faces(data.uri)
          .then(json => {
            console.log(json);
            const res = json;
            if (res[0].coordinates.length > 0) {
              console.log('face detected');
              navigation.navigate('LivenessPage');
              setVerification(prevVerification => {
                return {
                  ...prevVerification,
                  currentStep: 1,
                  selfie: data,
                  selfieVerified: true,
                };
              });
            } else {
              console.log('no face detected');
              navigation.navigate('LivenessPage');
              setVerification(prevVerification => {
                return {
                  ...prevVerification,
                  currentStep: 1,
                  selfie: data,
                  selfieVerified: false,
                };
              });
            }

            return Promise.resolve();
          })
          .catch(e => {
            console.log(e);
            navigation.navigate('ProgressPage');
            setVerification(prevVerification => {
              return {
                ...prevVerification,
                currentStep: 1,
                selfie: data,
                selfieVerified: false,
              };
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(e => {
        console.log('Could not take picture');
        navigation.navigate('ProgressPage');
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            currentStep: 1,
            selfie: null,
            selfieVerified: false,
          };
        });
      });
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
          </RNCamera>
          <TouchableHighlight style={styles.actionButton} onPress={checkSelfie}>
            <Text>Snap</Text>
          </TouchableHighlight>
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
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelfiePage;
