import { Badge, Button, Input, NativeBaseProvider, Select, HStack, Stack, Image, Row } from 'native-base';
import React from 'react';
import { Text, SafeAreaView, ScrollView, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { CHANGE_PASSWORD, LOGIN } from '../../constants/routes';
import * as authAction from '../../redux/authSlice'
import { useState, useEffect } from 'react';
import { getUser } from '../../utils/userHandle';
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'
import IconFA from 'react-native-vector-icons/FontAwesome'
import Loading from '../../components/Loading';
import { getUserByID, updateUserByID } from '../../services/UserService';
import { getDistrict, getProvince, getWard } from '../../services/AuthServices';
import { styles } from './styles';
import validator from 'validator';
import ModalChangePass from './ModalChangePass';
import ModalChangeAvatar from './ModalChangeAvatar';
import Warning from '../../components/Warning';
import Success from '../../components/Success';
import Error from '../../components/Error';

function Profile({ navigation }) {
    const [loading, setLoad] = useState(false)
    const [user, setUser] = useState()
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    useEffect(() => {
        async function getAuth() {
            setLoad(true)
            const user = await getUser()
            let id = user.id
            const info = await getUserByID(id)
            // console.log(info.data)
            if (info.success) {
                info.data.gender = info.data.gender.toLowerCase()
                setUser(info.data)
            }
        }
        getAuth()
    }, [])
    useEffect(() => {
        async function getProvinceAPI(data) {
            let provinces = await getProvince({ data });
            if (provinces.message === 'Success') {
                setProvinces(provinces.data);
            }
        }
        getProvinceAPI({});
    }, []);
    useEffect(() => {
        async function getDistrictAPI(province_id) {
            let districts = await getDistrict({ province_id });
            if (districts.message === 'Success') {
                setDistricts(districts.data);
            }
        }
        if (user?.province !== undefined) {
            getDistrictAPI(user?.province);
        }
    }, [user?.province]);
    useEffect(() => {
        async function getWardAPI(district_id) {
            let wards = await getWard({ district_id });
            if (wards.message === 'Success') {
                setWards(wards.data);
            }
        }
        if (user?.district !== undefined) {
            getWardAPI(user.district);
            setLoad(false)
        }
    }, [user?.district, user?.province]);
    const handleChangeWard = (e) => {
        setUser({ ...user, ward: e });
    };
    const handleChangeDistrict = (e) => {
        setUser({ ...user, district: e, ward: undefined });
    };
    const handleChangeProvince = (e) => {
        setUser({ ...user, province: e, district: undefined, ward: undefined });
    };
    const handleChangeName = (e) => {
        setUser({ ...user, name: e });
    };
    const handleChangePhone = (e) => {
        setUser({ ...user, phone: e });
    };
    const handleChangeAddress = (e) => {
        setUser({ ...user, address: e });
    };
    const handleChangeGender = (e) => {
        setUser({ ...user, gender: e.toLowerCase() });
    };
    const updateInfo = async (data, id) => {
        let checkName = validator.isEmpty(user.name);
        let checkPhone = validator.isMobilePhone(user.phone, 'vi-VN');
        let checkProvince = user.province;
        let checkDistrict = user.district;
        let checkWard = user.ward;
        let checkAddress = validator.isEmpty(user.address)
        if (checkName) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p t??n')
        }
        else if (!checkPhone) {
            Warning('TH??NG TIN KH??NG H???P L???','S??? ??i???n tho???i kh??ng h???p l???. Vui l??ng nh???p l???i')
        }
        else if (checkProvince === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n t???nh/th??nh ph???')
        }
        else if (checkDistrict === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n qu???n/huy???n')
        }
        else if (checkWard === undefined) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng ch???n x??/ph?????ng ')
        }
        else if (checkAddress) {
            Warning('TH??NG TIN KH??NG H???P L???','Vui l??ng nh???p ?????a ch???')
        }
        else {
            setLoad(true)
            let res = await updateUserByID(data, id);
            if (res.success) {
                Success('C???P NH???T TH??NH C??NG','Vui l??ng nh???n OK')
                setUser({ ...res.data, gender: res.data.gender.toLowerCase() });
                setLoad(false)
            } else {
                Error('C???p nh???t kh??ng th??nh c??ng')
                setLoad(false)
            }
        }
    };
    const handleSaveInfo = () => {
        updateInfo(user, user?.id);
    };
    const dispatch = useDispatch()
    const handleLogout = async () => {
        await dispatch(authAction.logout())
        navigation.navigate(LOGIN)
    }
    return (
        <NativeBaseProvider>
            <Loading loading={loading} />
            <ScrollView style={styles.container}>
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Badge>
                        <Image size={130} borderRadius={100} source={{
                            uri: user?.avatar
                        }} alt="Avatar..." />
                    </Badge>
                </View>
                <Stack space={2}>
                    <ModalChangeAvatar user={user} />
                    <Input
                        variant={'rounded'}
                        style={{ margin: 5 }}
                        size={'2xl'}
                        placeholder="T??n"
                        value={user?.name}
                        onChangeText={handleChangeName}
                    />
                    <Input
                        variant={'rounded'}
                        style={{ margin: 5 }}
                        size={'2xl'}
                        placeholder="S??? ??i???n tho???i"
                        value={user?.phone}
                        onChangeText={handleChangePhone}
                    />
                    <Select
                        variant="rounded"
                        width={"100%"}
                        size={'xl'}
                        placeholder='T???nh/Th??nh ph???'
                        selectedValue={user?.province}
                        onValueChange={handleChangeProvince}
                        style={{ margin: 5 }}
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <IconMUI name="arrow-down-plus" size={5} />
                        }} mt={1}>
                        {provinces.map((province) => (
                            <Select.Item key={province.ProvinceID} label={province.ProvinceName} value={+province.ProvinceID} />
                        ))}

                    </Select>
                    <Select
                        variant="rounded"
                        width={"100%"}
                        size={'xl'}
                        placeholder='Qu???n/Huy???n'
                        selectedValue={user?.district}
                        onValueChange={handleChangeDistrict}
                        style={{ margin: 5 }}
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <IconMUI name="arrow-down-plus" size={5} />
                        }} mt={1}>
                        {districts.map((district) => (
                            <Select.Item key={+district.DistrictID} label={district.DistrictName} value={+district.DistrictID} />
                        ))}
                    </Select>
                    <Select
                        variant="rounded"
                        width={"100%"}
                        size={'xl'}
                        placeholder='X??/Ph?????ng'
                        selectedValue={user?.ward}
                        onValueChange={handleChangeWard}
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
                        size={'2xl'}
                        style={{ margin: 5 }}
                        value={user?.address}
                        onChangeText={handleChangeAddress}
                    />
                    <ModalChangePass id={user?.id} />
                    <Button onPress={handleSaveInfo} borderRadius={'3xl'} colorScheme={'success'} size={'lg'}>
                        L??u
                    </Button>
                    <Button style={{marginBottom:5}} onPress={handleLogout} borderRadius={'3xl'} endIcon={<IconMUI name="logout" size={25} />} colorScheme={'error'} size={'lg'}>
                        ????ng xu???t
                    </Button>
                </Stack>
            </ScrollView>
        </NativeBaseProvider>

    );
}

export default Profile;