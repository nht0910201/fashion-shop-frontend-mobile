import React, { useState } from 'react';
import {
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Pressable,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { ALERT_TYPE, AlertNotificationRoot, Toast, Dialog } from 'react-native-alert-notification';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styles';
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconFA from 'react-native-vector-icons/FontAwesome'
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import { BOTTOM_TABS, FORGOT_PASSWORD, HOME, REGISTER } from '../../constants/routes';
import { gradientForm, main, white } from '../../constants/colors';
import { NativeBaseProvider, Image, Input, Stack, Button } from 'native-base'
import { useDispatch } from 'react-redux';
import { userLogin } from '../../services/AuthServices';
import * as authAction from '../../redux/authSlice'
import Error from '../../components/Error';
import Warning from '../../components/Warning';
import SuccessNavigate from '../../components/SuccessNavigate';
import Loading from '../../components/Loading';
import { useNavigation } from '@react-navigation/native';

function Login() {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [loading,setLoad] = useState(false)
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
        setLoad(true)
        let res = await userLogin({ username, password, otp })
        if (res.data.success) {
            if (res.data.data.role === 'ROLE_ADMIN' || res.data.data.role === 'ROLE_STAFF') {
                setLoad(false)
                Warning('Thông báo', 'Tài khoản không có quyền truy cập')
            } else {
                if (res.data.data.accessToken === 'unverified') {
                    setLoad(false)
                    Warning('Vui lòng xác thực', 'Vui lòng điền mã xác minh được gửi về email để hoàn thành xác thực')
                    setOtp({ ...otp, hidden: false })
                } else {
                    await dispatch(authAction.login(res.data));
                    setLoad(false)
                    SuccessNavigate('Đăng Nhập Thành Công', 'Vui lòng nhấn OK', navigation, BOTTOM_TABS)
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
            setLoad(false)
            Error(message)
        }
    }
    const handleLogin = () => {
        let otp = otpInput.otp
        login({ username, password, otp })
    }
    return (
        <NativeBaseProvider>
            <Loading loading={loading}/>
            <AlertNotificationRoot>
                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Image size='xl'
                                source={require('../../assets/REALSTYLE.png')}
                                alt="REALEST-FASHION-SHOP"
                            />
                        </View>
                        <Stack space={1} style={styles.content}>
                            <Text style={styles.loginContinueTxt}>ĐĂNG NHẬP</Text>
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
                                <Input
                                    InputLeftElement={<IconMUI name="verified" size={25} style={{ marginLeft: 10, padding: 5 }} color="muted.400" />}
                                    placeholder="OTP"
                                    value={otpInput.otp}
                                    onChangeText={onChangeOtpHandle}
                                    variant={'rounded'}
                                    size={'2xl'}
                                    style={{ margin: 5 }}
                                /> :
                                <></>}
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(FORGOT_PASSWORD, {
                                        userId: 'X0001',
                                    })
                                }
                                style={{ marginTop: 10 }}>
                                <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>
                            <View style={styles.loginBtnWrapper}>
                                <LinearGradient
                                    colors={[main, main]}
                                    style={styles.linearGradient}
                                    start={{ y: 0.0, x: 0.0 }}
                                    end={{ y: 1.0, x: 0.0 }}>
                                    <TouchableOpacity
                                        onPress={handleLogin}
                                        activeOpacity={0.7}
                                        style={styles.loginBtn}>
                                        <Text style={styles.loginText}>Đăng nhập</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                        </Stack>
                        <View style={styles.other}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginTop: 5 }}>
                                <Text style={styles.footerText}> Chưa có tài khoản ? </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate(REGISTER)}>
                                    <Text style={styles.signupBtn}>Đăng ký</Text>
                                </TouchableOpacity>
                            </View>
                            <Stack direction={{
                                base: "row",
                            }} space={1}>
                                <Button borderRadius={'3xl'} leftIcon={<IconFA name="google" size={25} />} colorScheme={'error'} size={'lg'}>
                                    Tiếp tục với Google
                                </Button>
                                <Button borderRadius={'3xl'} leftIcon={<IconFA name="facebook-square" size={25} />} colorScheme={'darkBlue'} size={'lg'}>
                                    Tiếp tục với Facebook
                                </Button>
                            </Stack>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </AlertNotificationRoot>
        </NativeBaseProvider>
    )
}

export default Login;