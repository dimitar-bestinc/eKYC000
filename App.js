import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Liveness from './src/Liveness';
import Home from './src/Home';
import IDScannerView from './src/IDScannerView';
import ProgressPage from './src/ProgressPage';
import Selfie from './src/Selfie';
import {VerificationProvider} from './src/context/VerificationContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <VerificationProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Demo'}}
          />
          <Stack.Screen name="Selfie" component={Selfie} />
          <Stack.Screen name="IDScannerView" component={IDScannerView} />
          <Stack.Screen name="Liveness" component={Liveness} />
          <Stack.Screen name="ProgressPage" component={ProgressPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </VerificationProvider>
  );
};

export default App;
