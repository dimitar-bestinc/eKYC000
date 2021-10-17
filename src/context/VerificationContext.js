import React, {useState, createContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_NANONETS_COUNT = 5;
const NANONETS_STATE_KEY = 'NANONETS_STATE_KEY';
const VerificationContext = createContext();
const initialState = {
  currentStep: 0,
  selfie: null,
  selfieVerified: false,
  frontIdPicture: null,
  frontIdPictureVerified: false,
  frontIdError: '',
  frontIdOCR: null,
  backIdPicture: null,
  nanonetsCount: null,
  nanonetsCountDate: null,
};

function VerificationProvider(props) {
  const [Verification, setVerification] = useState(initialState);
  const {nanonetsCount, nanonetsCountDate} = Verification;

  useEffect(() => {
    async function loadNanonetsState() {
      try {
        const oldStateString = await AsyncStorage.getItem(NANONETS_STATE_KEY);
        if (oldStateString) {
          const oldState = JSON.parse(oldStateString);
          const hours = Math.abs(new Date() - new Date(oldState.date)) / 36e5;
          if (hours > 24) {
            // 24hrs old, so reset
            setVerification(prevVerification => {
              return {
                ...prevVerification,
                nanonetsCount: MAX_NANONETS_COUNT,
                nanonetsCountDate: new Date(),
              };
            });
          } else {
            // set as retrieved count
            setVerification(prevVerification => {
              return {
                ...prevVerification,
                nanonetsCount: oldState.count,
                nanonetsCountDate: oldState.date,
              };
            });
          }
        } else {
          // no value restored, so reset
          setVerification(prevVerification => {
            return {
              ...prevVerification,
              nanonetsCount: MAX_NANONETS_COUNT,
              nanonetsCountDate: new Date(),
            };
          });
        }
      } catch (error) {}
    }

    loadNanonetsState();
  }, []);

  useEffect(() => {
    console.log('nanonetsCount', nanonetsCount);
    console.log('nanonetsCountDate', nanonetsCountDate);

    async function saveDate() {
      const stateToSave = {
        count: nanonetsCount,
        date: nanonetsCountDate,
      };
      try {
        await AsyncStorage.setItem(
          NANONETS_STATE_KEY,
          JSON.stringify(stateToSave),
        );
      } catch (error) {}
    }

    return async function cleanup() {
      saveDate();
    };
  }, [nanonetsCount, nanonetsCountDate]);

  return (
    <VerificationContext.Provider value={[Verification, setVerification]}>
      {props.children}
    </VerificationContext.Provider>
  );
}

export {VerificationContext, VerificationProvider};
