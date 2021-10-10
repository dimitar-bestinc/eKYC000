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

const renderStepThreeContainer = () => {
  return (
    <View style={styles.middleContainer}>
      <View style={styles.sector}>
        <Text style={{fontSize: 22}}>This is step three</Text>
      </View>
    </View>
  );
};

const ProgressPage = () => {
  const navigation = useNavigation();
  const [Verification, setVerification] = useContext(VerificationContext);
  const {selfie, currentStep, frontIdPicture} = Verification;

  const [isLoading, setIsLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState('unknown');

  const retakeSelfie = () => {
    setFaceDetected('unknown');
    navigation.navigate('Selfie');
  };

  const submitSelfie = async () => {
    try {
      await verifySelfie();
    } catch (e) {
    } finally {
    }
  };

  const verifySelfie = async () => {
    const formData = new FormData();

    formData.append('faces', {
      uri: selfie.uri,
      type: 'image/jpeg',
      name: 'picture',
    });

    try {
      setIsLoading(true);
      const response = await (
        await fetch('http://d745-96-27-135-242.ngrok.io/api/v1/detect_faces', {
          method: 'POST',
          body: formData,
        })
      ).json();

      console.log('response', response);
      if (response[0].coordinates.length !== 0) {
        setFaceDetected('no');
      } else {
        setFaceDetected('yes');
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            currentStep: 2,
            selfieVerified: true,
          };
        });
        navigation.navigate('Liveness');
      }
    } catch (err) {
      throw err;
    } finally {
      navigation.navigate('Liveness');
      setFaceDetected('yes');
      setVerification(prevVerification => {
        return {
          ...prevVerification,
          selfieVerified: true,
        };
      });
      setIsLoading(false);
    }
  };

  const renderMiddleContainer = () => {
    if (currentStep === 0) {
      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={{fontSize: 22}}>Your Selfie</Text>
          </View>
          <View style={styles.sector}>
            <SelfieSvg size={100} />
          </View>
          <View style={styles.sector}>
            <Text style={{fontSize: 14}}>
              Next, we will ask you to take a few selfies to compare your ID
            </Text>
          </View>
          <View style={styles.sector}>
            <Text style={{fontSize: 14}}>
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
            <Text style={{fontSize: 14}}>Why do we ask for this?</Text>
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
              <Text style={{fontSize: 22}}>No picture taken</Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <View>
              {faceDetected === 'no' && (
                <Text style={{fontSize: 18, padding: 10, color: 'red'}}>
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
                <Button title="Retake selfie" onPress={retakeSelfie} />
              </View>
              <View>
                {selfie && (
                  <Button title="Submit selfie" onPress={submitSelfie} />
                )}
              </View>
            </View>
          </View>
        </View>
      );
    } else if (currentStep === 2) {
      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={{fontSize: 22}}>Do liveness check now</Text>
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
        setFaceDetected('unknown');
        navigation.navigate('IDScannerView');
      };

      const submitIdFront = () => {
        console.log('Submit picture');
      };

      return (
        <View style={styles.middleContainer}>
          <View style={styles.sector}>
            <Text style={{fontSize: 22}}>Scan your ID documentation</Text>
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
              {faceDetected === 'no' && (
                <Text style={{fontSize: 18, padding: 10, color: 'red'}}>
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
      {isLoading ? (
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
            <View style={{paddingTop: 10}}>
              <Text style={{fontSize: 22}}>ID Verification Steps</Text>
            </View>

            <ProgressSteps activeStep={currentStep}>
              <ProgressStep
                label="Take Selfie"
                nextBtnTextStyle={{display: 'none'}}
                previousBtnTextStyle={{display: 'none'}}
              />
              <ProgressStep
                label="Verify Selfie"
                nextBtnTextStyle={{display: 'none'}}
                previousBtnTextStyle={{display: 'none'}}
              />
              <ProgressStep
                label="Check Liveness"
                nextBtnTextStyle={{display: 'none'}}
                previousBtnTextStyle={{display: 'none'}}
              />
              <ProgressStep
                label="Scan ID"
                nextBtnTextStyle={{display: 'none'}}
                previousBtnTextStyle={{display: 'none'}}
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
  },
});

export default ProgressPage;
