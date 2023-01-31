import React from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable } from 'react-native';
import { styles } from './styles';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { useState, useEffect } from "react";
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import { NativeBaseProvider, Input, Stack, Button } from "native-base";
import { Select } from "native-base";
import { getDistrict, getProvince, getWard, userRegister } from '../../services/AuthServices';
import { VERIFY_REGISTER } from '../../constants/routes';
import validator from 'validator';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import Warning from '../../components/Warning';

function Register({ navigation }) {
    const [loading, setLoad] = useState(false)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [province, setProvince] = useState()
    const [district, setDistrict] = useState()
    const [ward, setWard] = useState()
    useEffect(() => {
        async function getProvinceAPI(data) {
            let provinces = await getProvince({ data })
            if (provinces.message === 'Success') {
                setProvinces(provinces.data)
            }
        }
        getProvinceAPI({})
    }, [])
    useEffect(() => {
        async function getDistrictAPI(province_id) {
            let districts = await getDistrict({ province_id })
            if (districts.message === 'Success') {
                setDistricts(districts.data)
            }
        }
        if (province !== undefined) {
            setDistrict(undefined)
            setWard(undefined)
            setDistricts([])
            setWards([])
            getDistrictAPI(province)
        }
    }, [province])
    useEffect(() => {
        async function getWardAPI(district_id) {
            let wards = await getWard({ district_id })
            if (wards.message === 'Success') {
                setWards(wards.data)
            }
        }
        if (district !== undefined) {
            getWardAPI(district)
        }
    }, [district, province])
    const handleChangeWard = (e) => {
        setWard(e)
    }
    const handleChangeDistrict = (e) => {
        setDistrict(e)
        setWard(undefined)
        setWards([])
    }
    const handleChangeProvince = (e) => {
        setProvince(e)
        setDistrict(undefined)
        setWard(undefined)
    }
    const [name, setName] = useState('');
    const handleChangeName = (e) => {
        setName(e)
    }
    const [email, setEmail] = useState('');
    const handleChangeEmail = (e) => {
        setEmail(e)
    }
    const [phone, setPhone] = useState('');
    const handleChangePhone = (e) => {
        setPhone(e)
    }
    const [address, setAddress] = useState('');
    const handleChangeAddress = (e) => {
        setAddress(e)
    }
    const [gender, setGender] = useState('');
    const handleChangeGender = (e) => {
        setGender(e)
    }
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const handleChangePassword = (e) => {
        setPassword(e)
    }
    const handleChangeConfirm = (e) => {
        setConfirm(e)
    }
    const register = async ({ name, email, password, phone, province, district, ward, address, gender }) => {
        
        let checkName = validator.isEmpty(name)
        let checkGender = validator.isEmpty(gender)
        let checkEmail = validator.isEmail(email)
        let checkAddress = validator.isEmpty(address)
        let checkPhone = validator.isMobilePhone(phone, 'vi-VN')
        let checkPassword = validator.isEmpty(password)
        let checkConfirmPass = validator.isEmpty(confirm)
        if (checkName) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập tên')
        }
        else if (checkGender){
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng chọn giới tính')
        }
        else if (!checkEmail) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập email đúng định dạng')
        }
        else if (province === undefined) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng chọn tỉnh / thành phố')
        }
        else if (district === undefined) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng chọn quận / huyện')
        }
        else if (ward === undefined) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng chọn xã / phường')
        }
        else if (checkAddress) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập địa chỉ')
        }
        else if (!checkPhone) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập số điện thoại đúng định dạng')
        }
        else if (checkPassword) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập mật khẩu')
        }
        else if (password.length < 6) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập mật khẩu có độ dài ít nhất 6 kí tự')
        }
        else if (checkConfirmPass) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Vui lòng nhập lại mật khẩu')
        }
        else if (password !== confirm) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ','Mật khẩu nhập lại không chính xác')
        }
        else {
            let check = await userRegister({ name, email, password, phone, province, district, ward, address, gender })
            if (check.data.success) {
                navigation.navigate(VERIFY_REGISTER,{email:email});
            } else {
                if (check.data.status === 409) {
                    Error('Email đã tồn tại. Vui lòng nhập email khác')
                } else {
                    Error('Đã xảy ra lỗi khi đăng ký')
                }
            }
        }
    }
    const handleRegister = () => {
        register({ name, email, password, phone, province, district, ward, address, gender })
    }
    return (
        <NativeBaseProvider>
            <Loading loading={loading} />
            <AlertNotificationRoot>
                <SafeAreaView style={styles.container}>
                    <ScrollView style={{ width: '98%' }}>
                        <View style={styles.title}>
                            {/* <IconFA5 name={'user-plus'} size={50} /> */}
                            <Text style={{
                                fontSize: 23,
                                textAlign: 'center',
                                color: '#f5a524',
                                fontWeight: 'bold',
                            }}>Đăng ký</Text>
                        </View>
                        <View style={styles.content}>
                            <Stack space={3} w="100%" alignItems="center">
                                <Input
                                    placeholder="Tên"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                    value={name}
                                    onChangeText={handleChangeName}
                                />
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Giới tính"
                                    placeholder="Giới tính"
                                    selectedValue={gender}
                                    onValueChange={handleChangeGender}
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Nam" value="male" />
                                    <Select.Item label="Nữ" value="female" />
                                    <Select.Item label="Khác" value="other" />
                                </Select>
                                <Input
                                    placeholder="Email"
                                    variant={'rounded'}
                                    size={'2xl'}
                                    style={{ margin: 5 }}
                                    value={email}
                                    onChangeText={handleChangeEmail}
                                />
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Tỉnh/Thành phố"
                                    placeholder="Tỉnh/Thành phố"
                                    selectedValue={province}
                                    onValueChange={handleChangeProvince}
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    {provinces.map((province) => (
                                        <Select.Item key={province.ProvinceID} label={province.ProvinceName} value={province.ProvinceID} />
                                    ))}
                                </Select>
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Quận/Huyện"
                                    placeholder="Quận/Huyện"
                                    selectedValue={district}
                                    onValueChange={handleChangeDistrict}
                                    isDisabled={province === undefined ? true : false}
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    {districts.map((district) => (
                                        <Select.Item key={district.DistrictID} label={district.DistrictName} value={district.DistrictID} />
                                    ))}

                                </Select>
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Xã/PHường"
                                    placeholder="Xã/PHường"
                                    selectedValue={ward}
                                    onValueChange={handleChangeWard}
                                    isDisabled={district === undefined ? true : false}
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    {wards.map((ward) => (
                                        <Select.Item key={+ward.WardCode} label={ward.WardName} value={+ward.WardCode} />
                                    ))}

                                </Select>
                                <Input
                                    placeholder="Địa chỉ"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                    value={address}
                                    onChangeText={handleChangeAddress}
                                />
                                <Input
                                    placeholder="Số điện thoại"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                    value={phone}
                                    onChangeText={handleChangePhone}
                                />
                                <Input
                                    type={showPass ? "text" : "password"}
                                    InputRightElement={password.length === 0 ? '' :
                                        <Pressable onPress={() => setShowPass(!showPass)}>
                                            <IconMUI name={showPass ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                        </Pressable>
                                    }
                                    placeholder="Mật khẩu"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ marginHorizontal: 5, marginVertical: 5 }}
                                    value={password}
                                    onChangeText={handleChangePassword}
                                />
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    InputRightElement={password.length === 0 ? '' :
                                        <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                            <IconMUI name={showConfirm ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                        </Pressable>
                                    }
                                    placeholder="Nhập lại mật khẩu"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ marginHorizontal: 5, marginVertical: 5 }}
                                    value={confirm}
                                    onChangeText={handleChangeConfirm}
                                />
                            </Stack>
                            <Button
                                variant="solid"
                                size={'lg'}
                                onPress={handleRegister}
                                // onPress={()=>navigation.navigate(VERIFY_REGISTER,{email:email})}
                                bgColor={'#f5a524'}
                                style={{ margin: 10, width: '98%', borderRadius: 55 }}
                            >
                                Đăng ký
                            </Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </AlertNotificationRoot>
        </NativeBaseProvider>
    );
}

export default Register;