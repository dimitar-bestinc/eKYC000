import React from 'react';
import {useEffect, useReducer, useRef, useContext} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

import {RNCamera} from 'react-native-camera';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {VerificationContext} from './context/VerificationContext';

const {width: windowWidth} = Dimensions.get('window');

const PREVIEW_MARGIN_TOP = 50;
const PREVIEW_SIZE = Math.floor(windowWidth - 20);

// const PREVIEW_SIZE = 325
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};

const detections = {
  BLINK: {promptText: 'Blink both eyes', minProbability: 0.4},
  TURN_HEAD_LEFT: {promptText: 'Turn head left', maxAngle: -7.5},
  TURN_HEAD_RIGHT: {promptText: 'Turn head right', minAngle: 7.5},
  NOD: {promptText: 'Nod', minDiff: 1},
  SMILE: {promptText: 'Smile', minProbability: 0.7},
};

const promptsText = {
  noFaceDetected: 'No face detected',
  performActions: 'Perform the following actions:',
};

const detectionsList = [
  'BLINK',
  'TURN_HEAD_LEFT',
  'TURN_HEAD_RIGHT',
  'NOD',
  'SMILE',
];

const initialState = {
  faceDetected: false,
  promptText: promptsText.noFaceDetected,
  detectionsList,
  currentDetectionIndex: 0,
  progressFill: 0,
  processComplete: false,
};

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const LivenessPage = () => {
  const [Verification, setVerification] = useContext(VerificationContext);
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(detectionReducer, initialState);
  const rollAngles = useRef([]);
  const rect = useRef(null);
  let cameraRef = null;

  useEffect(() => {
    // randomize detection list to prevent pre-recorded video spoofing
    shuffle(detectionsList);
  }, []);

  const drawFaceRect = face => {
    // console.log("face",face)
    rect.current?.setNativeProps({
      width: 100,
      height: 100,
      top: face.bounds.origin.y,
      left: face.bounds.origin.x,
    });
  };

  const onFacesDetected = result => {
    console.log('onfaceDetected called');
    if (result.faces.length !== 1) {
      dispatch({type: 'FACE_DETECTED', value: 'no'});
      return;
    }

    const face = result.faces[0];

    // offset used to get the center of the face, instead of top left corner
    const midFaceOffsetY = face.bounds.size.height / 2;
    const midFaceOffsetX = face.bounds.size.width / 2;

    drawFaceRect(face);
    // make sure face is centered
    const faceMidYPoint = face.bounds.origin.y + midFaceOffsetY;
    // console.log(`
    // face.bounds.origin.y: ${face.bounds.origin.y}

    // `)
    if (
      // if middle of face is outside the preview towards the top
      faceMidYPoint <= PREVIEW_MARGIN_TOP ||
      // if middle of face is outside the preview towards the bottom
      faceMidYPoint >= PREVIEW_SIZE + PREVIEW_MARGIN_TOP
    ) {
      dispatch({type: 'FACE_DETECTED', value: 'no'});
      return;
    }

    const faceMidXPoint = face.bounds.origin.x + midFaceOffsetX;
    if (
      // if face is outside the preview towards the left
      faceMidXPoint <= windowWidth / 2 - PREVIEW_SIZE / 2 ||
      // if face is outside the preview towards the right
      faceMidXPoint >= windowWidth / 2 + PREVIEW_SIZE / 2
    ) {
      dispatch({type: 'FACE_DETECTED', value: 'no'});
      return;
    }

    // drawFaceRect(face)

    if (!state.faceDetected) {
      dispatch({type: 'FACE_DETECTED', value: 'yes'});
    }

    const detectionAction = state.detectionsList[state.currentDetectionIndex];

    switch (detectionAction) {
      case 'BLINK':
        // lower probabiltiy is when eyes are closed
        const leftEyeClosed =
          face.leftEyeOpenProbability <= detections.BLINK.minProbability;
        const rightEyeClosed =
          face.rightEyeOpenProbability <= detections.BLINK.minProbability;
        if (leftEyeClosed && rightEyeClosed) {
          dispatch({type: 'NEXT_DETECTION', value: null});
        }
        return;
      case 'NOD':
        // Collect roll angle data
        rollAngles.current.push(face.rollAngle);

        // Don't keep more than 10 roll angles
        if (rollAngles.current.length > 10) {
          rollAngles.current.shift();
        }

        // If not enough roll angle data, then don't process
        if (rollAngles.current.length < 10) {
          return;
        }

        // Calculate avg from collected data, except current angle data
        const rollAnglesExceptCurrent = [...rollAngles.current].splice(
          0,
          rollAngles.current.length - 1,
        );
        const rollAnglesSum = rollAnglesExceptCurrent.reduce((prev, curr) => {
          return prev + Math.abs(curr);
        }, 0);
        const avgAngle = rollAnglesSum / rollAnglesExceptCurrent.length;

        // If the difference between the current angle and the average is above threshold, pass.
        const diff = Math.abs(avgAngle - Math.abs(face.rollAngle));

        // console.log(`
        // avgAngle: ${avgAngle}
        // rollAngle: ${face.rollAngle}
        // diff: ${diff}
        // `)
        if (diff >= detections.NOD.minDiff) {
          dispatch({type: 'NEXT_DETECTION', value: null});
        }
        return;
      case 'TURN_HEAD_RIGHT':
        // console.log("TURN_HEAD_LEFT " + face.yawAngle)
        if (face.yawAngle <= detections.TURN_HEAD_LEFT.maxAngle) {
          dispatch({type: 'NEXT_DETECTION', value: null});
        }
        return;
      case 'TURN_HEAD_LEFT':
        // console.log("TURN_HEAD_RIGHT " + face.yawAngle)
        if (face.yawAngle >= detections.TURN_HEAD_RIGHT.minAngle) {
          dispatch({type: 'NEXT_DETECTION', value: null});
        }
        return;
      case 'SMILE':
        // higher probabiltiy is when smiling
        // console.log(face.smilingProbability)
        if (face.smilingProbability >= detections.SMILE.minProbability) {
          dispatch({type: 'NEXT_DETECTION', value: null});
        }
        return;
    }
  };

  useEffect(() => {
    if (state.processComplete) {
      setTimeout(() => {
        // delay so we can see progress fill aniamtion (500ms)
        // navigation.goBack()
        setVerification(prevVerification => {
          return {
            ...prevVerification,
            currentStep: 3,
          };
        });
        navigation.navigate('ProgressPage');
      }, 800);
    }
  }, [navigation, setVerification, state.processComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.topMaskContainer} />
      <View style={styles.leftMaskContainer} />
      <View style={styles.rightMaskContainer} />

      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.cameraPreview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.auto}
        captureAudio={false}
        onFacesDetected={onFacesDetected}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.none}
        faceDetectionClassifications={
          RNCamera.Constants.FaceDetection.Classifications.all
        }>
        <CameraPreviewMask width={'100%'} style={styles.circularProgress} />
        <AnimatedCircularProgress
          style={styles.circularProgress}
          size={PREVIEW_SIZE}
          width={5}
          backgroundWidth={7}
          tintColor="#3485FF"
          backgroundColor="#e8e8e8"
          fill={state.progressFill}
        />
      </RNCamera>

      <View style={styles.promptContainer}>
        <View>
          <Text style={styles.faceStatus}>
            {!state.faceDetected && promptsText.noFaceDetected}
          </Text>
          <Text style={styles.actionPrompt}>
            {state.faceDetected && promptsText.performActions}
          </Text>
          <Text style={styles.action}>
            {state.faceDetected &&
              detections[state.detectionsList[state.currentDetectionIndex]]
                .promptText}
          </Text>
        </View>
      </View>
    </View>
  );
};

const detectionReducer = (state, action) => {
  const numDetections = state.detectionsList.length;
  // +1 for face detection
  let newProgressFill = 0;
  // console.log(state.currentDetectionIndex);
  switch (action.type) {
    case 'FACE_DETECTED':
      if (action.value === 'yes') {
        newProgressFill =
          (100 / (numDetections + 1)) * (state.currentDetectionIndex + 1);
        return {...state, faceDetected: true, progressFill: newProgressFill};
      } else {
        // Reset
        return initialState;
      }
    case 'NEXT_DETECTION':
      const nextIndex = state.currentDetectionIndex + 1;
      if (nextIndex === numDetections) {
        // success
        return {...state, processComplete: true, progressFill: 100};
      }
      // next
      newProgressFill =
        (100 / (numDetections + 1)) * (state.currentDetectionIndex + 2);
      return {
        ...state,
        currentDetectionIndex: nextIndex,
        progressFill: newProgressFill,
      };
    default:
      throw new Error('Unexpeceted action type.');
  }
};

const CameraPreviewMask = props => (
  <Svg
    width={PREVIEW_SIZE}
    height={PREVIEW_SIZE}
    viewBox="0 0 300 300"
    fill="none"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M150 0H0v300h300V0H150zm0 0c82.843 0 150 67.157 150 150s-67.157 150-150 150S0 232.843 0 150 67.157 0 150 0z"
      fill="#fff"
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  promptContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: PREVIEW_MARGIN_TOP + PREVIEW_SIZE,
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  faceStatus: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
  },
  actionPrompt: {
    fontSize: 20,
    textAlign: 'center',
  },
  action: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  cameraPreview: {
    flex: 1,
  },
  circularProgress: {
    position: 'absolute',
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    top: PREVIEW_MARGIN_TOP,
    alignSelf: 'center',
  },

  topMaskContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: PREVIEW_MARGIN_TOP,
    backgroundColor: 'white',
    zIndex: 10,
  },
  leftMaskContainer: {
    position: 'absolute',
    top: PREVIEW_MARGIN_TOP,
    left: 0,
    width: (windowWidth - PREVIEW_SIZE) / 2,
    height: PREVIEW_SIZE,
    backgroundColor: 'white',
    zIndex: 10,
  },
  rightMaskContainer: {
    position: 'absolute',
    top: PREVIEW_MARGIN_TOP,
    right: 0,
    width: (windowWidth - PREVIEW_SIZE) / 2 + 1,
    height: PREVIEW_SIZE,
    backgroundColor: 'white',
    zIndex: 10,
  },

  preview: {
    height: PREVIEW_SIZE,
  },

  buttonWraper: {
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
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
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
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
});

export default LivenessPage;
