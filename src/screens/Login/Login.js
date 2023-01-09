import React, { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { ALERT_TYPE, AlertNotificationRoot, Toast, Dialog } from 'react-native-alert-notification';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import { FORGOT_PASSWORD, HOME, REGISTER } from '../../constants/routes';
import { gradientForm } from '../../constants/colors';
import { NativeBaseProvider, Link, Input, Stack } from 'native-base'
import { useDispatch } from 'react-redux';
import { userLogin } from '../../services/AuthServices';
import * as authAction from '../../redux/authSlice'

function Login({ navigation }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [otpInput, setOtp] = useState({ hidden: true, otp: '' })
    const handleChangeUsername = (e) => {
        setUsername(e)
    }
    const handleChangePassword = (e) => {
        setPassword(e)
    }
    const onChangeOtpHandle = (e) => {
        setOtp({ ...otpInput, otp: e })
    }
    const login = async ({ username, password, otp }) => {
        let res = await userLogin({ username, password, otp })
        if (res.data.success) {
            if (res.data.data.role === 'ROLE_ADMIN' || res.data.data.role === 'ROLE_STAFF') {
                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Waring',
                    textBody: 'Tài khoản không có quyền truy cập',
                    button:'Đóng'
                })
            } else {
                if (res.data.data.accessToken === 'unverified') {
                    Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Waring',
                        textBody: 'Vui lòng điền mã xác minh được gửi về email để hoàn thành xác thực!',
                        button:'Đóng'
                    })
                    setOtp({ ...otp, hidden: false })
                } else {
                    await dispatch(authAction.login(res.data));
                    navigation.navigate(HOME)
                }
            }
        }
        else {
            let message = "Sai tài khoản hoặc mật khẩu";
            if (otpInput.otp !== undefined && otpInput.otp !== '') {
                if (res.data.message === 'Expired') {
                    message = "OTP đã hết hạn!";
                    setOtp({ hidden: true, otp: '' })
                }
                message = "OTP không chính xác!";
            }
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Error',
                textBody: message,
                button:'Đóng'
            })
        }
    }
    const handleLogin = () => {
        let otp = otpInput.otp
        login({ username, password, otp })
    }
    return (
        <NativeBaseProvider>
            <AlertNotificationRoot>
                <SafeAreaView style={styles.main}>
                    <View style={styles.container}>
                        <View style={styles.wFull}>
                            <View style={styles.row}>
                                <Text style={styles.brandName}>REALEST</Text>
                            </View>
                            <Text style={styles.loginContinueTxt}>ĐĂNG NHẬP</Text>
                            <Stack space={2}>
                                <Input
                                    InputLeftElement={<IconMUI name="email" size={25} style={{ marginLeft: 10, padding: 5 }} color="muted.400" />}
                                    variant={'rounded'}
                                    style={{ margin: 5 }}
                                    size={'2xl'}
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChangeText={handleChangeUsername}
                                />
                                <Input
                                    type={show ? "text" : "password"}
                                    InputLeftElement={<IconFA5 name="unlock" size={25} style={{ marginLeft: 10, padding: 5 }} color="muted.400" />}
                                    InputRightElement={password.length === 0 ? '' :
                                        <Pressable onPress={() => setShow(!show)}>
                                            <IconMUI name={show ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                        </Pressable>}
                                    variant={'rounded'}
                                    style={{ margin: 5 }}
                                    size={'2xl'}
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChangeText={handleChangePassword}
                                />
                                {!otpInput.hidden ?
                                    <TextInput
                                        style={styles.input}
                                        placeholder="OTP"
                                        value={otpInput.otp}
                                        onChangeText={onChangeOtpHandle}
                                    /> :
                                    <></>}
                            </Stack>

                            <View style={styles.loginBtnWrapper}>
                                <LinearGradient
                                    colors={[gradientForm, '#f5a524']}
                                    style={styles.linearGradient}
                                    start={{ y: 0.0, x: 0.0 }}
                                    end={{ y: 1.0, x: 0.0 }}>
                                    {/******************** LOGIN BUTTON *********************/}
                                    <TouchableOpacity
                                        // onPress={() => navigation.navigate(HOME)}
                                        onPress={handleLogin}
                                        activeOpacity={0.7}
                                        style={styles.loginBtn}>
                                        <Text style={styles.loginText}>Đăng nhập</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                            {/***************** FORGOT PASSWORD BUTTON *****************/}
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(FORGOT_PASSWORD, {
                                        userId: 'X0001',
                                    })
                                }
                                style={styles.forgotPassBtn}>
                                <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <Text style={styles.footerText}> Don't have an account? </Text>
                                {/******************** REGISTER BUTTON *********************/}
                                <TouchableOpacity
                                    onPress={() => navigation.navigate(REGISTER)}>
                                    <Text style={styles.signupBtn}>Đăng ký</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}> Đăng nhập với </Text>
                            <Link _text={{ color: "red.600" }}>
                                Google
                            </Link>
                            <Text style={styles.footerText}> hoặc </Text>
                            <Link _text={{ color: "blue.600" }}>
                                Facebook
                            </Link>
                        </View>

                    </View>
                </SafeAreaView>
            </AlertNotificationRoot>

        </NativeBaseProvider>

    )
}

export default Login;