import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { main, white } from '../constants/colors';
import { FORGOT_PASSWORD, HOME, LOGIN, REGISTER } from '../constants/routes';
import Login from '../screens/Login';
import Register from '../screens/Register';
import BottomTabNavigator from './BottomTabNavigator';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{}} initialRouteName={LOGIN}>
      <Stack.Screen
        name={FORGOT_PASSWORD}
        component={ForgotPassword}
        options={({ route }) => ({
          headerTintColor: white,
          // headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: main,
          },
          title: route.params.userId,
        })}
      />
      <Stack.Screen
        name={LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={REGISTER}
        component={Register}
        options={{
          headerTintColor: white,
          // headerBackTitle: 'Back',
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: main,
          },
          title: 'Đăng ký',
        }}
      />
      <Stack.Screen
        name={HOME}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
