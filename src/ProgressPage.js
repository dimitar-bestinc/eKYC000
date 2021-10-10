import React from 'react';
import {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import SelfieSvg from './SelfieSvg';
import {useNavigation} from '@react-navigation/native';
import {VerificationContext} from './context/VerificationContext';
import {faceRecognitionService} from './services/face_recognition.service';

const ProgressPage = () => {
  const navigation = useNavigation();
  const [Verification, setVerification] = useContext(VerificationContext);
  const {selfie, selfieVerified, currentStep, frontIdPicture} = Verification;

  // const [isLoading, setIsLoading] = useState(false);
  // const [faceDetected, setFaceDetected] = useState(false);

  // const submitSelfie = async () => {
  //   setIsLoading(true);
  //   faceRecognitionService
  //     .detect_faces(selfie.uri)
  //     .then(json => {
  //       console.log(json);
  //       const res = json;
  //       if (res[0].coordinates.length === 0) {
  //         console.log('face detected');

  //         navigation.navigate('Liveness');
  //         setFaceDetected(true);
  //         setVerification(prevVerification => {
  //           return {
  //             ...prevVerification,
  //             selfieVerified: true,
  //           };
  //         });
  //       } else {
  //         console.log('no face detected');
  //         setFaceDetected(false);
  //         setVerification(prevVerification => {
  //           return {
  //             ...prevVerification,
  //             selfieVerified: false,
  //           };
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const renderMiddleContainer = () => {
    if (currentStep === 0) {
      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={styles.font22}>Your Selfie</Text>
          </View>
          <View style={styles.sector}>
            <SelfieSvg size={100} />
          </View>
          <View style={styles.sector}>
            <Text style={styles.font18}>
              Next, we will ask you to take a few selfies to compare your ID
            </Text>
          </View>
          <View style={styles.sector}>
            <Text style={styles.font18}>
              Start by looking directly at the camera
            </Text>
          </View>
          <View style={styles.sector}>
            <Button
              title="Use my camera"
              onPress={() => navigation.navigate('Selfie')}
            />
          </View>
          <View style={styles.sector}>
            <Text style={styles.font18}>Why do we ask for this?</Text>
          </View>
        </View>
      );
    } else if (currentStep === 1) {
      const selfieHeight = 200;
      const selfieWidth =
        selfie && selfieHeight * (selfie.width / selfie.height);

      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            {selfie ? (
              <Image
                source={{uri: selfie.uri, isStatic: true}}
                style={{width: selfieWidth, height: selfieHeight}}
              />
            ) : (
              <Text style={styles.font22}>No picture taken</Text>
            )}
          </View>
          <View style={styles.sector}>
            <View>
              {!selfieVerified && (
                <Text style={styles.cautionFont}>
                  No face detected, retake the picture
                </Text>
              )}
            </View>
            <View style={styles.sector}>
              <View>
                <Button
                  title="Retake selfie"
                  onPress={() => navigation.navigate('Selfie')}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else if (currentStep === 2) {
      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={styles.font22}>Do liveness check now</Text>
          </View>
          <View style={styles.sector}>
            <Button
              title="Start"
              onPress={() => navigation.navigate('Liveness')}
            />
          </View>
        </View>
      );
    } else if (currentStep === 3) {
      const IdHeight = 200;
      const IdWidth =
        frontIdPicture &&
        IdHeight * (frontIdPicture.width / frontIdPicture.height);

      const retakeIdFront = () => {
        navigation.navigate('IDScannerView');
      };

      const submitIdFront = () => {
        console.log('Submit picture');
      };

      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={styles.font22}>Scan your ID documentation</Text>
          </View>
          {frontIdPicture ? (
            <View style={styles.sector}>
              <Image
                source={{uri: frontIdPicture.uri, isStatic: true}}
                style={{width: IdWidth, height: IdHeight}}
              />
            </View>
          ) : (
            <View style={styles.sector}>
              <Button
                title="Use my camera"
                onPress={() => navigation.navigate('IDScannerView')}
              />
            </View>
          )}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View>
              {!selfieVerified && (
                <Text style={styles.cautionFont}>
                  No face detected, retake the picture
                </Text>
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                alignSelf: 'stretch',
                padding: 10,
              }}>
              <View>
                <Button title="Retake picture" onPress={retakeIdFront} />
              </View>
              <View>
                {frontIdPicture && (
                  <Button title="Submit picture" onPress={submitIdFront} />
                )}
              </View>
            </View>
          </View>
        </View>
      );
    } else {
    }
  };

  return (
    <View style={styles.container}>
      {false ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <View style={styles.topContainer}>
            <View style={styles.paddingTop10}>
              <Text style={styles.font22}>ID Verification Steps</Text>
            </View>

            <ProgressSteps activeStep={currentStep}>
              <ProgressStep
                label="Take Selfie"
                nextBtnTextStyle={styles.noDisplay}
                previousBtnTextStyle={styles.noDisplay}
              />
              <ProgressStep
                label="Check Selfie"
                nextBtnTextStyle={styles.noDisplay}
                previousBtnTextStyle={styles.noDisplay}
              />
              <ProgressStep
                label="Check Liveness"
                nextBtnTextStyle={styles.noDisplay}
                previousBtnTextStyle={styles.noDisplay}
              />
              <ProgressStep
                label="Scan ID"
                nextBtnTextStyle={styles.noDisplay}
                previousBtnTextStyle={styles.noDisplay}
              />
            </ProgressSteps>
          </View>

          {renderMiddleContainer()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
  },
  sector: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  paddingTop10: {
    paddingTop: 10,
  },
  font22: {
    fontSize: 22,
  },
  font18: {
    fontSize: 18,
  },
  noDisplay: {
    display: 'none',
  },
  cautionFont: {
    fontSize: 18,
    padding: 10,
    color: 'red',
  },
});

export default ProgressPage;
