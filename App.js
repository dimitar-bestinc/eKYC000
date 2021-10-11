import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LivenessPage from './src/LivenessPage';
import HomePage from './src/HomePage';
import IDScanPage from './src/IDScanPage';
import ProgressPage from './src/ProgressPage';
import SelfiePage from './src/SelfiePage';
import {VerificationProvider} from './src/context/VerificationContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <VerificationProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{title: 'Demo'}}
          />
          <Stack.Screen
            name="SelfiePage"
            component={SelfiePage}
            options={{title: 'Selfie'}}
          />
          <Stack.Screen
            name="LivenessPage"
            component={LivenessPage}
            options={{title: 'Liveness'}}
          />
          <Stack.Screen
            name="ProgressPage"
            component={ProgressPage}
            options={{title: 'Progress'}}
          />
          <Stack.Screen
            name="IDScanPage"
            component={IDScanPage}
            options={{title: 'Scan ID'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </VerificationProvider>
  );
};

export default App;
