import React, {useState, createContext} from 'react';

const VerificationContext = createContext();
const initialState = {
  currentStep: 0,
  selfie: null,
  selfieVerified: false,
  frontIdPicture: null,
  frontIdPictureVerified: false,
  backIdPicture: null,
};

function VerificationProvider(props) {
  const [Verification, setVerification] = useState(initialState);

  return (
    <VerificationContext.Provider value={[Verification, setVerification]}>
      {props.children}
    </VerificationContext.Provider>
  );
}

export {VerificationContext, VerificationProvider};
