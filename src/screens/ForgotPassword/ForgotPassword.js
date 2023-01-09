import { Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { styles } from './styles';

function ForgotPassword() {
    const route = useRoute();
    return (
        <View style={styles.container}>
            <Text>Forgot Password</Text>
            <Text>Params: {route.params.userId}</Text>
        </View>
    );
}

export default ForgotPassword;