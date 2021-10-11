import React, {useContext, useRef, useState} from 'react';
import {Text, ActivityIndicator} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {VerificationContext} from './context/VerificationContext';
import {useNavigation} from '@react-navigation/native';
import {ocrService} from './services/ocr_nanonets.service';
import {faceRecognitionService} from './services/face_recognition.service';

const ratio = {
  passport: 0.8,
  barcode: 0.4,
  default: 0.63,
};

const IDScanPage = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [Verification, setVerification] = useContext(VerificationContext);
  const {selfie, frontIdOCR} = Verification;
  const camera = useRef(null);
  const frameWidth = 300;
  const frameHeight = 300 * ratio.default;

  const takePicture = async () => {
    if (camera.current) {
      console.log('Take picture');
      const options = {
        fixOrientation: true,
        forceUpOrientation: true,
        base64: true,
        quality: 1,
        exif: true,
        orientation: RNCamera.Constants.ORIENTATION_UP,
      };

      return await camera.current.takePictureAsync(options);
    }
  };

  const checkPicture = picture => {
    takePicture()
      .then(data => {
        setIsLoading(true);
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            frontIdPicture: data,
          };
        });

        return faceRecognitionService
          .detect_faces(data.uri)
          .then(json => {
            console.log(json);
            console.log(json[0].coordinates);
            if (json[0].coordinates.length > 0) {
              console.log('face detected');

              return faceRecognitionService
                .compare_faces(selfie.uri, data.uri)
                .then(json1 => {
                  if (json1[0].result === 'True') {
                    console.log('face matched');

                    return ocrService
                      .ocr_predict_id_card(data.uri)
                      .then(json2 => {
                        console.log('ocr result');
                        if (
                          json2.message === 'Success' &&
                          json2.result[0].message === 'Success' &&
                          json2.result[0].prediction.length > 0
                        ) {
                          console.log(
                            'ocr success',
                            json2.result[0].prediction[0],
                          );
                          setVerification(prevVerification => {
                            return {
                              ...prevVerification,
                              frontIdOCR: json2.result[0].prediction,
                            };
                          });
                          navigation.navigate('ProgressPage');
                        }

                        return Promise.resolve();
                      })
                      .catch(e => {
                        console.log('ocr result error', e);
                      });
                  } else {
                    console.log('face does not match');
                    return Promise.resolve();
                  }
                })
                .catch(e => {
                  console.log('error comparing faces', e);
                });
            } else {
              console.log('no face detected');
              return Promise.resolve();
            }
          })
          .catch(e => {
            console.log('error detecting faces', e);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(e => {
        console.log('Could not take picture');
      });
  };

  return (
    <>
      {isLoading ? (
        <SafeAreaView style={styles.activityContainer}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.instruction}>
            Please scan the frontside of your ID.
          </Text>
          <RNCamera
            ref={camera}
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
              width={frameWidth}
              height={frameHeight}
            />
            <Text style={styles.capture} onPress={checkPicture}>
              [CAPTURE]
            </Text>
          </RNCamera>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
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
    position: 'absolute',
    bottom: 50,
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
    backgroundColor: 'tomato',
  },
  instruction: {
    textAlign: 'center',
    width: '80%',
    alignSelf: 'center',
    fontSize: 18,
    color: '#565656',
    fontFamily: 'Poppins-Regular',
    padding: 10,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zInex: 100,
  },
};

export default IDScanPage;
