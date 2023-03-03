import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import "intl";
import "intl/locale-data/jsonp/en";
import { cancelOrder, getOrder } from '../../services/UserService';
import { getDistrict, getProvince, getWard } from '../../services/AuthServices';
import { useState } from 'react';
import { useEffect } from 'react';
import SuccessNavigate from '../../components/SuccessNavigate';
import { MY_ORDER } from '../../constants/routes';
import Error from '../../components/Error';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { Button, Divider, HStack, NativeBaseProvider, VStack } from 'native-base';
import { Badge, Card } from '@rneui/themed';
import { FlatList } from 'react-native';
import { View } from 'react-native';
import Loading from '../../components/Loading';
import Reviews from './Reviews';

const state = {
    'enable': 'Hiện tại',
    'done': 'Hoàn tất',
    'process': 'Đang xử lý',
    'pending': 'Đang chờ xác nhận',
    'delivery': 'Đang giao hàng',
    'delivered': 'Đã giao hàng',
    'prepare': 'Đang chuẩn bị hàng',
    'cancel': 'Đã hủy',
}
function OrderDetail() {
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [order, setOrder] = useState({});
    const route = useRoute()
    const orderId = route.params.orderId
    useEffect(() => {
        async function getOrderDetail() {
            setLoading(true)
            let res = await getOrder(orderId)
            setOrder(res.data)
            setLoading(false)
        }
        getOrderDetail()
    }, [orderId])
    useEffect(() => {
        async function getProvinceAPI(data) {
            setLoading(true)
            let provinces = await getProvince({ data })
            if (provinces.message === 'Success') {
                setProvinces(provinces.data)
                setLoading(false)
            }
        }
        getProvinceAPI({})
    }, [])
    useEffect(() => {
        async function getDistrictAPI(province_id) {
            setLoading(true)
            let districts = await getDistrict({ province_id })
            if (districts.message === 'Success') {
                setDistricts(districts.data)
                setLoading(false)
            }
        }
        getDistrictAPI(+order.deliveryDetail?.receiveProvince)
    }, [order])
    useEffect(() => {
        async function getWardAPI(district_id) {
            setLoading(true)
            let wards = await getWard({ district_id })
            if (wards.message === 'Success') {
                setWards(wards.data)
                setLoading(false)
            }
        }
        getWardAPI(+order.deliveryDetail?.receiveDistrict)
    }, [order])
    const cancel = async (id) => {
        setLoading(true)
        let res = await cancelOrder(id)
        if (res.success) {
            SuccessNavigate('Huỷ đơn hàng thành công', 'Vui lòng nhấn OK', navigation, MY_ORDER)
            setLoading(false)
        } else {
            Error('Hủy đơn hàng thất bại')
            setLoading(false)
        }

    }
    const handleCancel = () => {
        cancel(orderId)
    }

    const finish = async (id) => {
        setLoading(true)
        let res = await finishOrder(id)
        if (res.success) {
            SuccessNavigate('Xác nhận đã nhận hàng thành công', 'Vui lòng nhấn OK', navigation, MY_ORDER)
            setLoading(false)
        } else {
            Error('Xác nhận đã nhận hàng thất bại')
            setLoading(false)
        }

    }
    const handleFinish = () => {
        finish(orderId)
    }
    return (
        <AlertNotificationRoot>
            <NativeBaseProvider>
                <Loading loading={loading} />
                <ScrollView>
                    <Text style={{ paddingTop: 10, color: 'black', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
                        Đơn hàng: {orderId}
                    </Text>
                    <View>
                        <FlatList
                            data={order?.items}
                            renderItem={({ item }) =>
                                <Card key={item.id}>
                                    <Card.Title style={{ fontSize: 18 }}>{item.name}</Card.Title>
                                    <Card.Divider />
                                    {/* <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8 } : {}} status={item.discount > 0 ? 'error' : ''} /> */}
                                    <Card.Image
                                        style={{ padding: 0 }}
                                        source={{
                                            uri: item.image
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
                                            {order?.state === 'done' || order?.state === 'delivered' ?
                                                <Reviews productId={item.id} productName={item.name} />
                                                : <></>
                                            }

                                        </VStack>
                                    </HStack>
                                </Card>
                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <Divider style={{ marginVertical: 10 }} />
                    <View>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Tạm tính:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{formatPrice(order?.totalPrice)}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Hình thức thanh toán:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{order?.paymentType}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Tình trạng thanh toán:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{order.paymentInfo?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Người nhận:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{order.deliveryDetail?.receiveName}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Số điện thoại:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{order.deliveryDetail?.receivePhone}</Text>
                        </HStack>
                        <VStack>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Địa chỉ:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontStyle: 'italic' }}>{order.deliveryDetail?.receiveAddress}/
                                {wards.map((ward) => (ward.WardCode === order.deliveryDetail?.receiveWard ? ward.WardName : ""))}/
                                {districts.map((district) => (district.DistrictID === +order.deliveryDetail?.receiveDistrict ? district.DistrictName : ""))}/
                                {provinces.map((province) => (province.ProvinceID === +order.deliveryDetail?.receiveProvince ? province.ProvinceName : ""))}</Text>
                        </VStack>
                        <Divider style={{ marginVertical: 10 }} />
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Tổng cộng:</Text>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' }}>{formatPrice(order.totalPrice + order.deliveryDetail?.deliveryInfo?.fee || order.totalPrice)}</Text>
                        </HStack>
                        <HStack justifyContent={'space-between'}>
                            <Text style={{ paddingHorizontal: 10, color: 'black', fontSize: 18, fontWeight: 'bold' }}>Trạng thái:</Text>
                            <Text
                                style={{
                                    color: order?.state === 'enable' ? 'blue' :
                                        order?.state === 'done' ? 'green' :
                                            order?.state === 'process' ? 'orange' :
                                                order?.state === 'pending' ? 'orange' :
                                                    order?.state === 'delivery' ? 'purple' :
                                                        order?.state === 'delivered' ? 'green' :
                                                            order?.state === 'prepare' ? 'orange' : 'red',
                                    fontSize: 20,
                                    fontStyle: 'italic',
                                    fontWeight: 'bold',
                                    paddingHorizontal: 10
                                }}
                            >
                                {state[order?.state]}
                            </Text>
                        </HStack>
                        <HStack justifyContent={'center'}>
                            {order?.state === 'pending' ?
                                <Button style={{ marginTop: 10 }} variant={'solid'} colorScheme={'red'} size={'lg'} borderRadius={'2xl'} onPress={handleCancel}>Huỷ đơn hàng</Button>
                                : order?.state === 'delivered' ?
                                    <Button style={{ marginTop: 10 }} variant={'solid'} colorScheme={'green'} size={'lg'} borderRadius={'2xl'} onPress={handleFinish}>Đã nhận hàng</Button>
                                    : <></>
                            }
                        </HStack>
                    </View>
                </ScrollView>
            </NativeBaseProvider>
        </AlertNotificationRoot >

    );
}

export default OrderDetail;