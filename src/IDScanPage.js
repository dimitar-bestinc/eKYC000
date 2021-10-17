import React, {useContext, useRef, useState} from 'react';
import {
  Text,
  ActivityIndicator,
  Modal,
  View,
  Image,
  Pressable,
} from 'react-native';
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
  const {selfie, nanonetsCount} = Verification;
  const camera = useRef(null);
  const frameWidth = 300;
  const frameHeight = 300 * ratio.default;
  const [modalVisible, setModalVisible] = useState(false);
  const [frontIdPicture, setFrontIdPicture] = useState(null);

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

  const confirmPicture = async () => {
    try {
      const data = await takePicture();
      setFrontIdPicture(data);
      setModalVisible(true);
    } catch (error) {}
  };

  const checkPicture = async () => {
    setModalVisible(false);
    setIsLoading(true);
    try {
      const json = await faceRecognitionService.detect_faces(
        frontIdPicture.uri,
      );
      console.log('success calling detect faces api', json);
      console.log(
        'success calling detect faces api json[0]',
        json[0].coordinates,
      );
      if (json.length > 0 && json[0].coordinates.length > 0) {
        console.log(
          'start calling compare_faces api',
          selfie.uri,
          frontIdPicture.uri,
        );
        const json1 = await faceRecognitionService.compare_faces(
          selfie.uri,
          frontIdPicture.uri,
        );
        console.log('success calling compare faces api, json1', json1);
        if (json1.result.length > 0 && json1.result.includes(true)) {
          console.log('success faces matched');
          console.log('start calling nanonets api', frontIdPicture.uri);

          if (nanonetsCount > 0) {
            setVerification(prevVerification => {
              return {
                ...prevVerification,
                nanonetsCount: nanonetsCount - 1,
              };
            });
            const json2 = await ocrService.ocr_predict_id_card(
              frontIdPicture.uri,
            );
            console.log('success calling nanonets api, json2', json2);
            if (
              json2.result.length > 0 &&
              json2.message === 'Success' &&
              json2.result[0].message === 'Success' &&
              json2.result[0].prediction.length > 0
            ) {
              console.log(
                'success nanonets api ocr success',
                json2.result[0].prediction,
                json2.result[0].prediction[0],
              );
              setVerification(prevVerification => {
                return {
                  ...prevVerification,
                  currentStep: 3,
                  frontIdPicture,
                  frontIdPictureVerified: true,
                  frontIdOCR: json2.result[0].prediction,
                };
              });
              console.log('navigate to progress page');
              setIsLoading(false);
              navigation.navigate('ProgressPage');
            }
          } else {
            console.log('Maximum limit exceed for Nanonets API');
            setIsLoading(false);
            setVerification(prevVerification => {
              return {
                ...prevVerification,
                frontIdPicture,
                frontIdError: 'Maximum limit exceed for Nanonets API',
                currentStep: 2,
              };
            });
            navigation.navigate('ProgressPage');
          }
        } else {
          console.log('faces does not match');
          setIsLoading(false);
          setVerification(prevVerification => {
            return {
              ...prevVerification,
              frontIdPicture,
              frontIdError: 'Faces does not match',
              currentStep: 2,
            };
          });
          navigation.navigate('ProgressPage');
        }
      } else {
        console.log('face not detected in the id card');
        setIsLoading(false);
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            frontIdPicture,
            frontIdError: 'Invalid face detected in your ID',
            currentStep: 2,
          };
        });
        navigation.navigate('ProgressPage');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error handling promises', error);
      setVerification(prevVerification => {
        return {
          ...prevVerification,
          frontIdPicture,
          frontIdError: 'Something went wrong with the process',
          currentStep: 2,
        };
      });
      navigation.navigate('ProgressPage');
    }
  };

  const idHeight = 200;
  const idWidth =
    frontIdPicture && idHeight * (frontIdPicture.width / frontIdPicture.height);

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
            <Text style={styles.capture} onPress={confirmPicture}>
              [CAPTURE]
            </Text>
          </RNCamera>
        </SafeAreaView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure all part of your ID card included?
            </Text>
            {frontIdPicture && (
              <Image
                source={{uri: frontIdPicture.uri, isStatic: true}}
                style={{width: idWidth, height: idHeight}}
              />
            )}
            <View style={styles.buttonsView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={checkPicture}>
                <Text style={styles.textStyle}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marging: 30,
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonsView: {
    alignSelf: 'stretch',
    margin: 20,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

export default IDScanPage;
