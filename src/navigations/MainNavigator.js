
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME, PRODUCT_DETAIL, PRODUCT_LIST } from '../constants/routes';
import ProductDetail from '../screens/ProductDetail';
import ProductList from '../screens/ProductList';
import Home from '../screens/Home';

const Stack = createStackNavigator();

function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={HOME}>
            <Stack.Screen
                name={HOME}
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={PRODUCT_LIST}
                component={ProductList}
                options={{title:''}}
            />
            <Stack.Screen
                name={PRODUCT_DETAIL}
                component={ProductDetail}
                options={{title:'Chi tiết sản phẩm' }}
            />
        </Stack.Navigator>
    );
}
export default MainNavigator;