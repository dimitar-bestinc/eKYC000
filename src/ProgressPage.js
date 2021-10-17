import React from 'react';
import {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ActivityIndicator,
} from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import SelfieSvg from './svg/SelfieSvg';
import {useNavigation} from '@react-navigation/native';
import {VerificationContext} from './context/VerificationContext';

const ProgressPage = () => {
  const navigation = useNavigation();
  const [Verification, setVerification] = useContext(VerificationContext);
  const {
    selfie,
    selfieVerified,
    currentStep,
    frontIdPicture,
    frontIdPictureVerified,
    frontIdError,
    frontIdOCR,
    nanonetsCount,
  } = Verification;

  const renderMiddleContainer = () => {
    console.log('current step', currentStep);
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
              onPress={() => navigation.navigate('SelfiePage')}
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
                  onPress={() => navigation.navigate('SelfiePage')}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else if (currentStep === 2) {
      const IdHeight = 200;
      const IdWidth =
        frontIdPicture &&
        IdHeight * (frontIdPicture.width / frontIdPicture.height);

      // if (!nanonetsCount) {
      //   return (
      //     <View style={styles.middleContainer}>
      //       <View style={styles.sector}>
      //         <Text style={styles.font22}>
      //           Try again tomorrow, your daily request count limited
      //         </Text>
      //       </View>
      //     </View>
      //   );
      // }

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
                title="Scan your ID"
                onPress={() => navigation.navigate('IDScanPage')}
              />
            </View>
          )}
          <View style={styles.sector}>
            {frontIdPicture && !frontIdPictureVerified && (
              <Text style={styles.cautionFont}>{frontIdError}</Text>
            )}
          </View>

          <View style={styles.sector}>
            {frontIdPicture && !frontIdPictureVerified && (
              <Button
                title="Retake picture"
                onPress={() => navigation.navigate('IDScanPage')}
              />
            )}
          </View>
        </View>
      );
    } else if (currentStep === 3) {
      if (frontIdOCR && frontIdOCR.length > 0) {
        return (
          <View style={styles.middleContainer}>
            {frontIdOCR.map(item => (
              <View style={styles.sector}>
                <Text>
                  {item.label} : {item.ocr_text}
                </Text>
              </View>
            ))}
          </View>
        );
      }
    } else {
    }
  };

  return (
    <View style={styles.container}>
      {false ? (
        <View style={styles.sector}>
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
                label="Scan ID"
                nextBtnTextStyle={styles.noDisplay}
                previousBtnTextStyle={styles.noDisplay}
              />
              <ProgressStep
                label="OCR"
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
