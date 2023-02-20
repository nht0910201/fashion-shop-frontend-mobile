import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MY_ORDER, ORDER_DETAIL } from '../constants/routes';
import MyOrder from '../screens/MyOrder';
import OrderDetail from '../screens/OrderDetail';
import { main, white } from '../constants/colors';

const Stack = createStackNavigator();

function OrderNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={MY_ORDER}>
            <Stack.Screen
                name={MY_ORDER}
                component={MyOrder}
                options={{ title: 'Đơn hàng' ,headerStyle:{backgroundColor:main},headerTintColor: white,}}

            />
            <Stack.Screen
                name={ORDER_DETAIL}
                component={OrderDetail}
                options={{ title: 'Chi tiết đơn hàng' ,headerStyle:{backgroundColor:main},headerTintColor: white,}}
            />
        </Stack.Navigator>
    );
}

export default OrderNavigator;