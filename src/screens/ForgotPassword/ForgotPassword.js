import { Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { styles } from './styles';

function ForgotPassword() {
    const route = useRoute();
    return (
        <SafeAreaView style={styles.container}>
            <Text>Forgot Password</Text>
            <Text>Params: {route.params.userId}</Text>
        </SafeAreaView>
    );
}

export default ForgotPassword;