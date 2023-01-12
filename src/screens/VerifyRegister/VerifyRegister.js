import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from "./styles";
import { NativeBaseProvider, Input, Button } from "native-base";
import Loading from "../../components/Loading";
import Warning from "../../components/Warning";
import SuccessNavigate from "../../components/SuccessNavigate";
import { LOGIN } from "../../constants/routes";
import Error from "../../components/Error";

function VerifyRegister() {
    const [loading,setLoad] = useState(false)
    const naviagtion = useNavigation()
    const route = useRoute()
    let email = route.params.email
    let type = 'register'
    const [otp,setOtp] = useState('')
    const handleChangeOTP = (e) => {
        setOtp(e)
    }
    const verify = async ({otp,email,type}) => {
        if(otp.length === 0){
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập mã xác thực được gửi về email bạn đã nhập')
        }else{
            setLoad(true)
            const res = await verifyUser({otp,email,type})
            if(res.data.success){
                setLoad(false)
                SuccessNavigate('XÁC THỰC THÀNH CÔNG','Bạn đã có thể đăng nhập vào hệ thống',naviagtion,LOGIN)
            }else{
                setLoad(false)
                Error('Đã xảy ra lỗi khi xác thực')
            }
        } 
    }
    const handleVerify = () => {
        verify({otp,email,type})
    }
    return (
        <NativeBaseProvider>
            <Loading loading={loading}/>
            <AlertNotificationRoot>
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <Text style={{
                            fontSize: 28,
                            textAlign: 'center',
                            color: '#f5a524',
                            fontWeight: 'bold',
                            marginBottom:30
                        }}>XÁC THỰC NGƯỜI DÙNG</Text>
                        <Input
                            placeholder="OTP"
                            variant={'rounded'}
                            size={'lg'}
                            style={{ margin: 5 }}
                            value={otp}
                            onChangeText={handleChangeOTP}
                        />
                        <Button
                            variant="solid"
                            size={'lg'}
                            bgColor={'#f5a524'}
                            style={{ margin: 10, width: '100%', borderRadius: 55 }}
                            onPress={handleVerify}
                        >
                            Xác thực
                        </Button>
                    </View>
                </SafeAreaView>
            </AlertNotificationRoot>
        </NativeBaseProvider>

    );
}

export default VerifyRegister;