import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { main, white } from '../constants/colors';
import { BOTTOM_TABS, CHANGE_PASSWORD, FORGOT_PASSWORD, HOME, LOGIN, PRODUCT_DETAIL, PRODUCT_LIST, REGISTER, VERIFY_REGISTER } from '../constants/routes';
import Login from '../screens/Login';
import Register from '../screens/Register';
import BottomTabNavigator from './BottomTabNavigator';
import ForgotPassword from '../screens/ForgotPassword';
import VerifyRegister from '../screens/VerifyRegister';
import ProductList from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail';

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
          title: 'Quên mật khẩu',
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
        name={BOTTOM_TABS}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={VERIFY_REGISTER}
        component={VerifyRegister}
        options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
}

export default AuthNavigator;
