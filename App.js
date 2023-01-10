import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigations/AuthNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export default function App() {
  // isAuthenticated = is...
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </Provider>

  );
}
