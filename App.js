import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigations/AuthNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { getUser } from './src/utils/userHandle';
import { useState,useEffect } from 'react';
import BottomTabNavigator from './src/navigations/BottomTabNavigator';

export default function App() {
  const [user,setUser] = useState()
  useEffect(()=>{
    async function getAuth(){
      const auth = await getUser();
      setUser(auth)
    }
    getAuth()
  })
  return (
    <Provider store={store}>
      <NavigationContainer>
        {user === undefined ? <AuthNavigator /> : <BottomTabNavigator/>}
      </NavigationContainer>
    </Provider>

  );
}
