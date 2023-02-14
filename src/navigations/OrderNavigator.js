import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MY_ORDER, ORDER_DETAIL } from '../constants/routes';
import MyOrder from '../screens/MyOrder';
import OrderDetail from '../screens/OrderDetail';

const Stack = createStackNavigator();

function OrderNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={MY_ORDER}>
            <Stack.Screen
                name={MY_ORDER}
                component={MyOrder}
                options={{ title: 'Đơn hàng' }}

            />
            <Stack.Screen
                name={ORDER_DETAIL}
                component={OrderDetail}
                options={{ title: 'Chi tiết đơn hàng' }}
            />
        </Stack.Navigator>
    );
}

export default OrderNavigator;