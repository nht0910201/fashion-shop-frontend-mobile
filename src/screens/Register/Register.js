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
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p t??n')
        }
        else if (checkGender){
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n gi???i t??nh')
        }
        else if (!checkEmail) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p email ????ng ?????nh d???ng')
        }
        else if (province === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n t???nh / th??nh ph???')
        }
        else if (district === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n qu???n / huy???n')
        }
        else if (ward === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n x?? / ph?????ng')
        }
        else if (checkAddress) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p ?????a ch???')
        }
        else if (!checkPhone) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p s??? ??i???n tho???i ????ng ?????nh d???ng')
        }
        else if (checkPassword) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p m???t kh???u')
        }
        else if (password.length < 6) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p m???t kh???u c?? ????? d??i ??t nh???t 6 k?? t???')
        }
        else if (checkConfirmPass) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p l???i m???t kh???u')
        }
        else if (password !== confirm) {
            Warning('TH??NG TIN KH??NG H???P L???','M???t kh???u nh???p l???i kh??ng ch??nh x??c')
        }
        else {
            let check = await userRegister({ name, email, password, phone, province, district, ward, address, gender })
            if (check.data.success) {
                navigation.navigate(VERIFY_REGISTER,{email:email});
            } else {
                if (check.data.status === 409) {
                    Error('Email ???? t???n t???i. Vui l??ng nh???p email kh??c')
                } else {
                    Error('???? x???y ra l???i khi ????ng k??')
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
                            }}>????ng k??</Text>
                        </View>
                        <View style={styles.content}>
                            <Stack space={3} w="100%" alignItems="center">
                                <Input
                                    placeholder="T??n"
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
                                    accessibilityLabel="Gi???i t??nh"
                                    placeholder="Gi???i t??nh"
                                    selectedValue={gender}
                                    onValueChange={handleChangeGender}
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Nam" value="male" />
                                    <Select.Item label="N???" value="female" />
                                    <Select.Item label="Kh??c" value="other" />
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
                                    accessibilityLabel="T???nh/Th??nh ph???"
                                    placeholder="T???nh/Th??nh ph???"
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
                                    accessibilityLabel="Qu???n/Huy???n"
                                    placeholder="Qu???n/Huy???n"
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
                                    accessibilityLabel="X??/PH?????ng"
                                    placeholder="X??/PH?????ng"
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
                                    placeholder="?????a ch???"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                    value={address}
                                    onChangeText={handleChangeAddress}
                                />
                                <Input
                                    placeholder="S??? ??i???n tho???i"
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
                                    placeholder="M???t kh???u"
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
                                    placeholder="Nh???p l???i m???t kh???u"
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
                                ????ng k??
                            </Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </AlertNotificationRoot>
        </NativeBaseProvider>
    );
}

export default Register;