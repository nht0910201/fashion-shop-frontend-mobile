import { Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { Button, Input, NativeBaseProvider } from 'native-base';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { useState } from 'react';
import Loading from '../../components/Loading';
import { resetPassword, verifyUser } from '../../services/AuthServices';
import SuccessNavigate from '../../components/SuccessNavigate';
import { useNavigation } from '@react-navigation/native';
import Success from '../../components/Success';
import Error from '../../components/Error';
import validator from 'validator';
import Warning from '../../components/Warning';
import { storeToken } from '../../utils/tokenHandle';
import { forgotPassword } from '../../services/UserService';
import { LOGIN } from '../../constants/routes';

function ForgotPassword() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0)
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfrimPassword] = useState('');
    const handleChangeEmail = (e) => {
        setEmail(e)
    }
    const handleChangeOtp = (e) => {
        setOTP(e)
    }
    const handleChangeNewPassword = (e) => {
        setNewPassword(e)
    }
    const handleChangeConfirmPass = (e) => {
        setConfrimPassword(e)
    }
    const type = 'reset'
    const [id, setId] = useState('')
    const sendOTP = async () => {
        if (validator.isEmpty(email)) {
            Warning('Vui lòng nhập email', 'Vui lòng nhấn OK')
        }
        else if (!validator.isEmail(email)) {
            Warning('Vui lòng nhập email đúng định dạng', 'Vui lòng nhấn OK')
        }
        else {
            setLoading(true);
            let res = await resetPassword({ email })
            console.log(res)
            if (res.data.success) {
                Success('Mã xác thực đã được gủi đến email', 'Vui lòng nhấn OK')
                setStep(step + 1)
                setLoading(false)
            } else {
                Error('Gửi OTP thất bại')
                setLoading(false)
            }
        }
    }
    const handleClickContinue = () => {
        sendOTP()
    }
    const verifyOTP = async () => {
        let checkOTP = validator.isEmpty(otp)
        if (checkOTP) {
            Warning('Vui lòng nhập OTP', 'Vui lòng nhấn OK')
        }
        else {
            setLoading(true);
            let res = await verifyUser({ otp, email, type })
            if (res.data.success) {
                Success('Xác thực OTP thành công', 'Vui lòng nhấn OK')
                setId(res.data.data.id);
                storeToken(res.data.data.token)
                setStep(step + 1)
                setLoading(false)
            } else {
                Error('OTP không đúng')
                setLoading(false)
            }
        }
    }
    const handleClickVerifyOTP = () => {
        verifyOTP()
    }
    let oldPassword = otp;
    const updatePassword = async () => {
        let checkPassword = validator.isEmpty(newPassword)
        let checkConfirmPass = validator.isEmpty(confirmPassword)
        if (checkPassword) {
            Warning('Vui lòng nhập mật khẩu mới', 'Vui lòng nhấn OK')
        }
        else if (newPassword.length < 6) {
            Warning('Vui lòng nhập mật khẩu có độ dài ít nhất 6 kí tự', 'Vui lòng nhấn OK')
        }
        else if (checkConfirmPass) {
            Warning('Vui lòng nhập xác nhận mật khẩu mới', 'Vui lòng nhấn OK')
        }
        else if (newPassword !== confirmPassword) {
            Warning('Xác nhận mật khẩu không đúng', 'Vui lòng nhấn OK')
        }
        else {
            setLoading(true)
            let res = await forgotPassword({ oldPassword, newPassword }, id)
            if (res.success) {
                SuccessNavigate('Khôi phục mật khẩu thành công', 'Vui lòng nhấn OK', navigation, LOGIN)
                setLoading(false)
            } else {
                Error('Khôi phục mật khẩu thất bại')
                setLoading(false)
            }
        }
    }
    const handleClickConfirm = () => {
        updatePassword()
    }
    const reSendOTP = async () => {
        setLoading(true)
        let res = await resetPassword({ email })
        if (res.data.success) {
            Success('OTP đã được gửi đến email','Vui lòng nhấn OK')
            setLoading(false)
        } else {
            Error('Gửi OTP thất bại')
            setLoading(false)
        }
    }
    const handleClickResend = () => {
        reSendOTP()
    }
    return (
        <NativeBaseProvider>
            <AlertNotificationRoot>
                <Loading loading={loading} />
                {step === 0 ?
                    <SafeAreaView style={styles.container}>
                        <Text style={{
                            fontSize: 28,
                            textAlign: 'center',
                            color: '#f5a524',
                            fontWeight: 'bold',
                            marginBottom: 30
                        }}>KHÔI PHỤC MẬT KHẨU</Text>
                        <Input
                            placeholder="Email"
                            variant={'rounded'}
                            size={'2xl'}
                            style={{ margin: 5 }}
                            value={email}
                            onChangeText={handleChangeEmail}
                        />
                        <Button
                            variant="solid"
                            size={'lg'}
                            bgColor={'#f5a524'}
                            style={{ margin: 10, width: '100%', borderRadius: 55 }}
                            onPress={handleClickContinue}
                        >
                            Tiếp theo
                        </Button>
                    </SafeAreaView>
                    :
                    <></>}
                {step === 1 ?
                    <SafeAreaView style={styles.container}>
                        <Text style={{
                            fontSize: 28,
                            textAlign: 'center',
                            color: '#f5a524',
                            fontWeight: 'bold',
                            marginBottom: 30
                        }}>XÁC THỰC</Text>
                        <Input
                            placeholder="OTP"
                            variant={'rounded'}
                            size={'2xl'}
                            style={{ margin: 5 }}
                            value={otp}
                            onChangeText={handleChangeOtp}
                        />
                        <Button
                            variant="unstyled"
                            size={'lg'}
                            // bgColor={'#f5a524'}
                            // style={{ margin: 10, width: '100%', borderRadius: 55 }}
                            onPress={handleClickResend}
                        >Gửi lại OTP</Button>
                        <Button
                            variant="solid"
                            size={'lg'}
                            bgColor={'#f5a524'}
                            style={{ margin: 10, width: '100%', borderRadius: 55 }}
                            onPress={handleClickVerifyOTP}
                        >
                            Tiếp theo
                        </Button>
                    </SafeAreaView>
                    : <></>}
                {step === 2 ?
                    <SafeAreaView style={styles.container}>
                        <Text style={{
                            fontSize: 28,
                            textAlign: 'center',
                            color: '#f5a524',
                            fontWeight: 'bold',
                            marginBottom: 30
                        }}>ĐẶT LẠI MẬT KHẨU</Text>
                        <Input
                            placeholder="Mật khẩu mới"
                            variant={'rounded'}
                            size={'2xl'}
                            style={{ margin: 5 }}
                            value={newPassword}
                            onChangeText={handleChangeNewPassword}
                        />
                        <Input
                            placeholder="Xác nhận mật khẩu mới"
                            variant={'rounded'}
                            size={'2xl'}
                            style={{ margin: 5 }}
                            value={confirmPassword}
                            onChangeText={handleChangeConfirmPass}
                        />
                        <Button
                            variant="solid"
                            size={'lg'}
                            bgColor={'#f5a524'}
                            style={{ margin: 10, width: '100%', borderRadius: 55 }}
                            onPress={handleClickConfirm}
                        >
                            Xác nhận
                        </Button>
                    </SafeAreaView>
                    : <></>}
            </AlertNotificationRoot>

        </NativeBaseProvider>

    );
}

export default ForgotPassword;