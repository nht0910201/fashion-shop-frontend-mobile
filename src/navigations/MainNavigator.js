
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME, PRODUCT_DETAIL, PRODUCT_LIST } from '../constants/routes';
import ProductDetail from '../screens/ProductDetail';
import ProductList from '../screens/ProductList';
import Home from '../screens/Home';
import { main, white } from '../constants/colors';

const Stack = createStackNavigator();

function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={HOME}>
            <Stack.Screen
                name={HOME}
                component={Home}
                options={{ headerShown: false}}
            />
            <Stack.Screen
                name={PRODUCT_LIST}
                component={ProductList}
                options={{title:'',headerStyle:{backgroundColor:main},headerTintColor: white,}}
            />
            <Stack.Screen
                name={PRODUCT_DETAIL}
                component={ProductDetail}
                options={{title:'Chi tiết sản phẩm' ,headerStyle:{backgroundColor:main},headerTintColor: white,}}
            />
        </Stack.Navigator>
    );
}
export default MainNavigator;