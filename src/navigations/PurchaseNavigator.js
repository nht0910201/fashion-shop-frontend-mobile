import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MAKE_ORDER, SHOPPING_CART } from '../constants/routes';
import ShoppingCart from '../screens/ShoppingCart';
import Order from '../screens/Order';

const Stack = createStackNavigator();

function PurchaseNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={SHOPPING_CART}>
            <Stack.Screen
                name={SHOPPING_CART}
                component={ShoppingCart}
                options={{ title:'Giỏ hàng'}}

            />
            <Stack.Screen
                name={MAKE_ORDER}
                component={Order}
                options={{ title: 'Đặt hàng'}}
            />
        </Stack.Navigator>
    );
}

export default PurchaseNavigator;