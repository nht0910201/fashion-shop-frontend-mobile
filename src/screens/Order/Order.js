import React from "react";
import { Linking, Text } from "react-native";
import { ScrollView } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";
import { useNavigation } from '@react-navigation/native';
import { getCart } from "../../services/CartService";
import { useState } from "react";
import { useEffect } from "react";
import { getUserByID } from "../../services/UserService";
import { getDistrict, getProvince, getWard, getService, calShipingFee } from "../../services/AuthServices";
import { getUser } from "../../utils/userHandle";
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'
import { Button, Divider, HStack, Image, Input, NativeBaseProvider, Radio, Select, Spacer, VStack } from "native-base";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { FlatList } from "react-native";
import { Badge, Card } from "@rneui/themed";
import { View } from "react-native";
import Loading from "../../components/Loading";
import validator from "validator";
import Warning from "../../components/Warning";
import Error from "../../components/Error";
import { makeAnOrder } from "../../services/Payment";
import SuccessNavigate from "../../components/SuccessNavigate";
import { ORDER_SUCCESS, SHOPPING_CART } from "../../constants/routes";
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';

function Order() {
    let navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [userCur, setUserCur] = useState()
    useEffect(() => {
        async function getAuth() {
            let res = await getUser()
            setUserCur(res)
        }
        getAuth()
    }, [])
    const [cart, setCart] = useState({});
    useEffect(() => {
        async function getData() {
            setLoading(true)
            let res = await getCart();
            if (res.success) {
                setCart(res.data);
                setLoading(false)
            }
        }
        getData();
    }, []);

    const [user, setUser] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [shippingFee, setShippingFee] = useState(0);
    const [serviceType, setServiceType] = useState({});

    useEffect(() => {
        async function getData() {
            let res = await getUserByID(userCur?.id);
            if (res.success) {
                setUser(res.data);
            }
        }
        getData();
    }, [userCur?.id]);
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
        if (province !== undefined) {
            getDistrictAPI(province);
        }
    }, [province]);

    useEffect(() => {
        async function getWardAPI(district_id) {
            let wards = await getWard({ district_id });
            if (wards.message === 'Success') {
                setWards(wards.data);
            }
        }
        if (district !== undefined) {
            getWardAPI(district);
        }
    }, [province, district]);

    useEffect(() => {
        async function getServiceTypeAPI() {
            if (district, ward) {
                let service = await getService({
                    to_district_id: district,
                });
                if (service.code === 200) {
                    setServiceType({ list: service.data, value: service.data[0]?.service_type_id });
                }
            } else setServiceType();
        }
        getServiceTypeAPI();
    }, [district, ward]);
    useEffect(() => {
        async function calShippingFeeAPI() {
            if (district && ward && cart.totalProduct && serviceType) {
                let fee = await calShipingFee({
                    service_type_id: serviceType.value,
                    to_district_id: district,
                    to_ward_code: ward,
                    weight: 30 * cart.totalProduct < 30000 ? 30 * cart.totalProduct : 30000,
                    height: cart.totalProduct < 150 ? cart.totalProduct : 150,
                });
                if (fee.code === 200) {
                    setShippingFee(fee.data.total);
                }
            } else setShippingFee(0);
        }
        calShippingFeeAPI();
    }, [serviceType]);

    const handleChangeWard = (e) => {
        setUser({ ...user, ward: e });
        setWard(e);
    };
    const handleChangeService = (e) => {
        setServiceType({ ...serviceType, value: e });
    };
    const handleChangeDistrict = (e) => {
        setUser({ ...user, district: e });
        setDistrict(e);
        setWard(undefined);
        setWards([]);
    };
    const handleChangeProvince = (e) => {
        setUser({ ...user, province: e });
        setProvince(e);
        setDistrict(undefined);
        setWard(undefined);
        setDistricts([]);
        setWards([]);
    };
    const handleChangeName = (e) => {
        setUser({ ...user, name: e });
    };
    const handleChangePhone = (e) => {
        setUser({ ...user, phone: e });
    };
    const handleChangeEmail = (e) => {
        setUser({ ...user, email: e });
    };
    const handleChangeAddress = (e) => {
        setUser({ ...user, address: e });
    };
    const [paymentType, setPaymentType] = useState('cod');
    const [redURL, setURL] = useState('')
    const makeOrder = async (paymentType, orderId, user) => {
        if (validator.isEmpty(user.name)) {
            Warning('Vui lòng nhập tên người nhận hàng', 'Vui lòng nhấn OK')
        }
        else if (!validator.isEmail(user.email)) {
            Error('Email không hợp lệ', 'Nhấn OK và nhập lại email')
        }
        else if (!validator.isMobilePhone(user.phone, 'vi-VN')) {
            Error('Số điện thoại không hợp lệ', 'Nhấn OK và nhập lại số điện thoại')
        }
        else if (province === undefined) {
            Warning('Vui lòng chọn tỉnh/thành phố', 'Vui lòng nhấn OK')
        }
        else if (district === undefined) {
            Warning('Vui lòng chọn quận/huyện phố', 'Vui lòng nhấn OK')
        } else if (ward === undefined) {
            Warning('Vui lòng chọn xã/phường phố', 'Vui lòng nhấn OK')
        } else if (serviceType === undefined) {
            Warning('Vui lòng chọn tỉnh/thành phố', 'Vui lòng nhấn OK')
        }
        else if (validator.isEmpty(user.address)) {
            Warning('Vui lòng chọn tỉnh/thành phố', 'Vui lòng nhấn OK')
        }
        else {
            setLoading(true)
            let res = await makeAnOrder(paymentType, orderId, {
                ...user,
                shippingFee: shippingFee, serviceType: serviceType.value
            });
            if (res.data.success) {
                if (paymentType === 'cod') {
                    setLoading(false)
                    // SuccessNavigate('Đặt hàng thành công', 'Vui lòng nhấn OK', navigation, SHOPPING_CART)
                    // window.location.href = '/redirect/payment?success=true&cancel=false'
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'Đặt hàng thành công',
                        textBody: 'Vui lòng nhấn OK',
                        button: 'OK',
                        onPressButton: () => { navigation.navigate(SHOPPING_CART,{refresh:true}) }
                    })
                } else {
                    setURL(res.data.data)
                    setLoading(false)

                }
            } else {
                if (res.data.status === 409) {
                    const errMsg = res.data.message.split(':')[1];
                    setLoading(false)
                    Error(`Quá số lượng sản phẩm ${errMsg} hiện có. Vui lòng chọn số lượng khác`);
                } else {
                    setLoading(false)
                    Error('Đặt hàng không thành công');
                }
            }
        }
    };
    const handleClickOrder = () => {
        makeOrder(paymentType, cart.id, user);
    };
    return (
        <AlertNotificationRoot>
            <NativeBaseProvider>
                <Loading loading={loading} />
                <ScrollView>
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingVertical: 10 }}>SẢN PHẨM TRONG GIỎ HÀNG</Text>
                    <View>
                        {cart === '404' ?
                            <Text style={{ textAlign: 'center', color: 'black', fontSize: 16, marginHorizontal: 'auto' }}>Không có sản phẩm</Text>
                            :
                            <>
                                <FlatList
                                    data={cart?.items}
                                    renderItem={({ item }) =>
                                        <Card key={item.id}>
                                            <Card.Title style={{ fontSize: 18 }}>{item.name}</Card.Title>
                                            <Card.Divider />
                                            {/* <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8 } : {}} status={item.discount > 0 ? 'error' : ''} /> */}
                                            <Card.Image
                                                style={{ padding: 0 }}
                                                source={{
                                                    uri:
                                                        item.image
                                                }}
                                            />
                                            <HStack justifyContent={'space-between'}>
                                                <VStack alignItems={'flex-start'}>
                                                    <HStack alignItems={'center'}>
                                                        <Text style={{ fontSize: 18, color: 'black' }}>Màu: </Text>
                                                        <Badge
                                                            badgeStyle={{
                                                                width: 20,
                                                                height: 20,
                                                                backgroundColor: item.color,
                                                                borderColor: item.color === '#ffffff' ? 'black' : '',
                                                                borderStyle: 'solid',
                                                                borderWidth: 1,
                                                                marginRight: 3,
                                                            }}
                                                        ></Badge>
                                                    </HStack>
                                                    <Text style={{ fontSize: 18, color: 'black' }}>Size: {item.size}</Text>
                                                    <Text style={{ fontSize: 18, color: 'black' }}>Số lượng: {item.quantity}</Text>
                                                </VStack>
                                                <VStack alignItems={'flex-start'}>
                                                    <Text style={{ color: 'red', fontSize: 20 }}>{formatPrice(item.subPrice)}</Text>
                                                    <Text style={{ color: 'black', fontSize: 16, textDecorationLine: 'line-through' }}>{formatPrice(item.price * item.quantity)}</Text>
                                                </VStack>
                                            </HStack>
                                        </Card>
                                    }
                                    keyExtractor={item => item.id}
                                />
                            </>
                        }
                    </View>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingVertical: 10 }}>THANH TOÁN</Text>
                    <HStack justifyContent={'space-between'}>
                        <Text style={{ color: 'black', fontSize: 22 }}>TẠM TÍNH:</Text>
                        <Text style={{ color: 'black', fontSize: 22 }}>{formatPrice(cart.totalPrice)}</Text>
                    </HStack>

                    <HStack justifyContent={'space-between'}>
                        <Text style={{ color: 'black', fontSize: 22 }}>PHÍ VẬN CHUYỂN:</Text>
                        <Text style={{ color: 'black', fontSize: 22 }}>{formatPrice(shippingFee)}</Text>
                    </HStack>
                    <HStack justifyContent={'space-between'}>
                        <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold' }}>TỔNG CỘNG:</Text>
                        <Text style={{ color: 'black', fontSize: 22, fontWeight: 'bold' }}>{formatPrice(cart.totalPrice + shippingFee)}</Text>
                    </HStack>
                    <Divider style={{ marginVertical: 10 }} />
                    <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingVertical: 10 }}>THÔNG TIN GIAO HÀNG</Text>
                    <VStack space={2} style={{ paddingHorizontal: 10 }}>
                        <Input width={'100%'} size={'2xl'} variant="rounded" placeholder="Nguyễn Văn A" value={user.name} onChangeText={handleChangeName} />
                        <Input width={'100%'} size={'2xl'} variant="rounded" placeholder="abc@gmail.com" value={user.email} onChangeText={handleChangeEmail} />
                        <Input width={'100%'} size={'2xl'} variant="rounded" placeholder="Số điện thoại" value={user.phone} onChangeText={handleChangePhone} />
                        <Select
                            variant="rounded"
                            width={"100%"}
                            size={'xl'}
                            placeholder='Tỉnh/Thành phố'
                            selectedValue={province || ''}
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
                            isDisabled={province === undefined ? true : false}
                            placeholder='Quận/Huyện'
                            selectedValue={district || ''}
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
                            isDisabled={district === undefined ? true : false}
                            placeholder='Xã/Phường'
                            selectedValue={ward || ''}
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
                        <Input width={'100%'} size={'2xl'} variant="rounded" placeholder="Địa chỉ" value={user.address} onChangeText={handleChangeAddress} />
                        <Select
                            variant="rounded"
                            width={"100%"}
                            size={'xl'}
                            isDisabled={serviceType?.list === undefined ? true : false}
                            placeholder='Phương thức vận chuyển'
                            value={serviceType?.value || ''}
                            onChange={handleChangeService}
                            style={{ margin: 5 }}
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <IconMUI name="arrow-down-plus" size={5} />
                            }} mt={1}>
                            <Select.Item isDisabled value="" label="Phương thức vận chuyển" />
                            {serviceType?.list?.map((s) => (
                                <Select.Item key={s.service_type_id} value={s.service_type_id} label={s.short_name} />
                            ))}
                        </Select>
                        <Text style={{ paddingHorizontal: 10, fontSize: 18, fontWeight: 'bold', color: 'black' }}>Phương thức thanh toán: </Text>
                        <Radio.Group value={paymentType} onChange={setPaymentType} name="Payment" accessibilityLabel="Choose payment">
                            <VStack space={2} style={{ paddingHorizontal: 10 }}>
                                <Radio colorScheme={'yellow'} value={'cod'} isInvalid size={'lg'}>
                                    <Image source={{
                                        uri: "https://img.freepik.com/premium-vector/cash-delivery_569841-162.jpg?w=2000"
                                    }} alt="COD" size="sm" />
                                    Thanh toán khi nhận hàng
                                </Radio>
                                {/* <Radio colorScheme={'yellow'} value={'vnpay'} isInvalid size={'lg'}>
                                    <Image source={{
                                        uri: "https://doanhnghiep.quocgiakhoinghiep.vn/wp-content/uploads/2020/07/1581089357407-1580819448160-vnpay.png"
                                    }} alt="VN-PAY" size="sm" />
                                    VN-PAY
                                </Radio>
                                <Radio colorScheme={'yellow'} value={'paypal'} isInvalid size={'lg'}>
                                    <Image source={{
                                        uri: "https://www.paypalobjects.com/webstatic/icon/pp258.png"
                                    }} alt="PAYPAL" size="sm" />
                                    PAYPAL
                                </Radio> */}
                            </VStack>
                        </Radio.Group>
                        <Button onPress={handleClickOrder} variant={'solid'} colorScheme={'yellow'} size={'lg'} borderRadius={'3xl'}>
                            Đặt hàng
                        </Button>
                    </VStack>
                </ScrollView>
            </NativeBaseProvider>
        </AlertNotificationRoot>
    );
}

export default Order;