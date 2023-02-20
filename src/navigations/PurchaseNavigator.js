import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MAKE_ORDER, SHOPPING_CART } from '../constants/routes';
import ShoppingCart from '../screens/ShoppingCart';
import Order from '../screens/Order';
import { main, white } from '../constants/colors';

const Stack = createStackNavigator();

function PurchaseNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={SHOPPING_CART}>
            <Stack.Screen
                name={SHOPPING_CART}
                component={ShoppingCart}
                options={{ title:'Giỏ hàng',headerStyle:{backgroundColor:main},headerTintColor: white,}}

            />
            <Stack.Screen
                name={MAKE_ORDER}
                component={Order}
                options={{ title: 'Đặt hàng',headerStyle:{backgroundColor:main},headerTintColor: white,}}
            />
        </Stack.Navigator>
    );
}

export default PurchaseNavigator;