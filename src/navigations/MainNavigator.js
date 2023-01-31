
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function MainNavigator() {
    return (
        <Stack.Navigator screenOptions={{}} initialRouteName={{}}>
            <Stack.Screen
                // name={FORGOT_PASSWORD}
                // component={ForgotPassword}
                options={({ route }) => ({
                    headerTintColor: white,
                    // headerBackTitle: 'Back',
                    headerBackTitleVisible: false,
                    headerStyle: {
                        backgroundColor: main,
                    },
                    title: route.params.userId,
                    // headerShown:false
                })}
            />
        </Stack.Navigator>
    );
}
export default MainNavigator;