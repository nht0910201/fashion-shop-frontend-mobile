import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigations/AuthNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { getUser } from './src/utils/userHandle';
import { useState,useEffect } from 'react';
import BottomTabNavigator from './src/navigations/BottomTabNavigator';
import { isExpired } from 'react-jwt';
import { getToken } from './src/utils/tokenHandle';

export default function App() {
  const [user,setUser] = useState()
  const [token,settoken] = useState('')
  useEffect(()=>{
    async function getAuth(){
      const auth = await getUser();
      const authToken = await getToken()
      setUser(auth)
      settoken(authToken)
    }
    getAuth()
  })
  return (
    <Provider store={store}>
      <NavigationContainer>
        {user !== undefined || !isExpired(token) ? <BottomTabNavigator/> : <AuthNavigator /> }
      </NavigationContainer>
    </Provider>

  );
}
