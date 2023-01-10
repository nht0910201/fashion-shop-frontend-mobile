import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME, PROFILE } from '../constants/routes';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import HomeIcon from 'react-native-vector-icons/FontAwesome5'
import UserIcon from 'react-native-vector-icons/FontAwesome5'

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home';
            return <HomeIcon name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user';
            return <UserIcon name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name={HOME} component={Home} />
      <Tab.Screen name={PROFILE} component={Profile} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
