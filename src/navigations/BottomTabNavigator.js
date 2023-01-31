import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME, PROFILE } from '../constants/routes';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getUser } from '../utils/userHandle';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const [user, setUser] = useState()
  useEffect(() => {
    async function getAuth() {
      const auth = await getUser();
      setUser(auth)
    }
    getAuth()
  }, [])
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home';
            return <IconFA5 name={iconName} size={size} color={color} />;
          } 
          // else if (route.name === 'Profile') {
          //   iconName = focused ? 'shopping-bag' : 'shopping-bag';
          //   return <IconFA5 name={iconName} size={size} color={color} />;
          // }
          // else if (route.name === 'Profile') {
          //   iconName = focused ? 'receipt' : 'receipt';
          //   return <IconFA5 name={iconName} size={size} color={color} />;
          // }
          else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
            return <IconFA5 name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name={HOME} component={Home} options={{title:'Trang chủ',headerShown:false}}/>
      <Tab.Screen name={PROFILE} component={Profile} options={{title:'Thông tin cá nhân'}}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
