import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // Import NavigationContainer
import AppNavigator from './home/home'; 

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;