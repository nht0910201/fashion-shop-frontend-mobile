import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME, MAIN_NAV, MY_ORDER, PROFILE, PURCHASE, SHOPPING_CART } from '../constants/routes';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { getUser } from '../utils/userHandle';
import ShoppingCart from '../screens/ShoppingCart';
import MyOrder from '../screens/MyOrder';
import { main } from '../constants/colors';
import MainNavigator from './MainNavigator';
import PurchaseNavigator from './PurchaseNavigator';
import OrderNavigator from './OrderNavigator';

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
          else if (route.name === 'Purchase') {
            iconName = focused ? 'shopping-bag' : 'shopping-bag';
            return <IconFA5 name={iconName} size={size} color={color} />;
          }
          else if (route.name === 'MyOrder') {
            iconName = focused ? 'receipt' : 'receipt';
            return <IconFA5 name={iconName} size={size} color={color} />;
          }
          else if (route.name === 'Profile') {
            iconName = focused ? 'user-alt' : 'user-alt';
            return <IconFA5 name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'green',
        tabBarLabelStyle:{fontSize:14},
        headerShown: true,
      })}
    >
      <Tab.Screen name={HOME} component={MainNavigator} options={{title:'Trang chủ',headerShown:false}}/>
      <Tab.Screen name={PURCHASE} component={PurchaseNavigator} options={{title:'Giỏ hàng',headerShown:false}}/>
      <Tab.Screen name={MY_ORDER} component={OrderNavigator} options={{title:'Đơn hàng',headerShown:false}}/>
      <Tab.Screen name={PROFILE} component={Profile} options={{title:'Thông tin'}}/>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
