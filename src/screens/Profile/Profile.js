import { Button, NativeBaseProvider } from 'native-base';
import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { LOGIN } from '../../constants/routes';
import * as authAction from '../../redux/authSlice'
function Profile({ navigation }) {
    const dispatch = useDispatch()
    const handleLogout = async () => {
        await dispatch(authAction.logout())
        navigation.navigate(LOGIN)
    }
    return (
        <NativeBaseProvider>
            <SafeAreaView>
                <Text>Profile</Text>
                <Button onPress={handleLogout}>Đăng xuất</Button>
            </SafeAreaView>
        </NativeBaseProvider>

    );
}

export default Profile;