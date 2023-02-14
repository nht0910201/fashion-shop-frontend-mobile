import { Card } from "@rneui/themed";
import { Button, Checkbox, HStack, NativeBaseProvider, Popover } from "native-base";
import React, { useEffect } from "react";
import { useState } from "react";
import { FlatList, Text } from "react-native";
import { ScrollView } from "react-native";
import Loading from "../../components/Loading";
import { getOrders } from "../../services/UserService";
import "intl";
import "intl/locale-data/jsonp/en";
import { filter } from 'smart-array-filter'
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native';
import { ORDER_DETAIL } from "../../constants/routes";
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

function MyOrder() {
    const navigation = useNavigation()
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [order, setOrder] = useState([])
    const [curOrders, setCur] = useState([])
    const [filterOrders, setFilterOrder] = useState([])
    const [loading, setLoading] = useState(false);
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
    const arrState = [
        { name: 'done', val: 'Hoàn tất' },
        { name: 'process', val: 'Đang xử lý' },
        { name: 'pending', val: 'Đang chờ xác nhận' },
        { name: 'delivery', val: 'Đang giao hàng' },
        { name: 'delivered', val: 'Đã giao hàng' },
        { name: 'prepare', val: 'Đang chuẩn bị hàng' },
        { name: 'cancel', val: 'Đã hủy' },
    ]
    useEffect(() => {
        async function getData() {
            setLoading(true);
            let res = await getOrders();
            if (res.success) {
                let temp1 = res.data.filter((order) => order.state !== 'enable');
                setOrder(temp1);
                setCur(temp1.slice(0, 5))
                setFilterOrder(temp1)
                setLoading(false);
            } else {
                setLoading('404');
            }
        }
        getData();
    }, []);
    const [isOpen1, setIsOpen1] = useState(false);
    let [page, setPage] = useState(1)
    const pagnition = []
    const totalPage = Math.ceil(filterOrders.length / 5)
    for (let i = 1; i <= totalPage; i++) {
        pagnition.push(i)
    }
    const handleChangePage = (page) => {
        setPage(page)
        setCur(filterOrders?.slice(5 * page - 5, 5 * page))
    }
    const [filterState, setFilter] = useState([])
    const handleFilter = () => {
        let arr = order
        if (filterState.length > 0) {
            arr = filter(arr, {
                keywords: `state:${filterState}`
            })
        }
        if (arr.length > 0) {
            setCur(arr.slice(0, 5))
            setPage(1)
            setFilterOrder(arr)
        }
    }
    const handleReset = () => {
        setFilter([])
        setFilterOrder(order)
        setCur(order.slice(0, 5))
        setPage(1)
    }
    return (
        <NativeBaseProvider>
            <Loading loading={loading} />
            <ScrollView>
                {loading === '404' ?
                    <Text>Bạn chưa có đơn hàng nào</Text>
                    :
                    <>
                        <Text style={{ color: 'black', fontSize: 25, fontWeight: 'bold', textAlign: 'center', paddingTop: 10 }}>ĐƠN HÀNG CỦA BẠN</Text>
                        <Popover
                            placement={'bottom right'} trigger={triggerProps => {
                                return <Button variant={'outline'} alignSelf="center" {...triggerProps} onPress={() => setIsOpen1(true)}>
                                    <IconMUI name="filter-menu" size={25} />
                                </Button>;
                            }} isOpen={isOpen1} onClose={() => setIsOpen1(!isOpen1)}>
                            <Popover.Content w="56">
                                <Popover.Arrow />
                                <Popover.CloseButton onPress={() => setIsOpen1(false)} />
                                <Popover.Header>Bộ lọc</Popover.Header>
                                <Popover.Body>
                                    <Text>Trạng thái:</Text>
                                    <Checkbox.Group accessibilityLabel="Status" value={filterState} onChange={setFilter}>
                                        {arrState.map((state) => (
                                            <Checkbox key={state.name} value={state.name} size={'md'}>
                                                {state.val}
                                            </Checkbox>
                                        ))}
                                    </Checkbox.Group>
                                </Popover.Body>
                                <Popover.Footer justifyContent="flex-end">
                                    <Button.Group space={2}>
                                        <Button colorScheme="coolGray" variant="ghost" onPress={handleReset}>
                                            Xoá bộ lọc
                                        </Button>
                                        <Button colorScheme="danger" onPress={handleFilter}>
                                            Xem kết quả
                                        </Button>
                                    </Button.Group>
                                </Popover.Footer>
                            </Popover.Content>
                        </Popover>
                        <FlatList
                            data={curOrders}
                            renderItem={({ item }) =>
                                <Card key={item.id}>
                                    <Card.Title onPress={() => navigation.navigate(ORDER_DETAIL, { orderId: item.id })} style={{ fontSize: 18 }}>Mã đơn hàng: {item.id}</Card.Title>
                                    <Card.Divider />
                                    <HStack justifyContent={'space-between'}>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Ngày đặt: </Text>
                                        <Text style={{ color: 'black', fontSize: 16, fontStyle: 'italic' }}>{item.createdDate}</Text>
                                    </HStack>
                                    <HStack justifyContent={'space-between'}>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Người đặt: </Text>
                                        <Text style={{ color: 'black', fontSize: 16, fontStyle: 'italic' }}>{item.userName}</Text>
                                    </HStack>
                                    <HStack justifyContent={'space-between'}>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Số lượng sản phẩm: </Text>
                                        <Text style={{ color: 'black', fontSize: 16, fontStyle: 'italic' }}>{item.totalProduct}</Text>
                                    </HStack>
                                    <HStack justifyContent={'space-between'}>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Tổng số tiền: </Text>
                                        <Text style={{ color: 'black', fontSize: 16, fontStyle: 'italic' }}>{formatPrice(item.totalPrice)}</Text>
                                    </HStack>
                                    <HStack justifyContent={'space-between'}>
                                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Trạng thái: </Text>
                                        <Text
                                            style={{
                                                color: item.state === 'enable' ? 'blue' :
                                                    item.state === 'done' ? 'green' :
                                                        item.state === 'process' ? 'orange' :
                                                            item.state === 'pending' ? 'orange' :
                                                                item.state === 'delivery' ? 'purple' :
                                                                    item.state === 'delivered' ? 'green' :
                                                                        item.state === 'prepare' ? 'orange' : 'red',
                                                fontSize: 16,
                                                fontStyle: 'italic',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {state[item.state]}
                                        </Text>
                                    </HStack>
                                    <Text onPress={() => navigation.navigate(ORDER_DETAIL, { orderId: item.id })} style={{color:'blue',textAlign:'right',fontSize:16,fontStyle:'italic'}}>
                                        Xem chi tiết
                                        <IconFA5 name="long-arrow-alt-right" size={12}/>
                                    </Text>
                                </Card>
                            }
                            keyExtractor={item => item.id}
                        />
                        <HStack style={{ marginTop: 10 }} space={1} alignItems='center' justifyContent={'center'}>
                            {pagnition?.length > 0 ?
                                pagnition.map((idx) => (
                                    <Button
                                        key={idx}
                                        variant={idx === page ? 'solid' : 'subtle'}
                                        colorScheme={idx === page ? 'danger' : 'gray'}
                                        onPress={() => { handleChangePage(idx) }}
                                    >
                                        {idx}
                                    </Button>
                                ))
                                : <></>}
                        </HStack>
                    </>
                }
            </ScrollView>
        </NativeBaseProvider>
    );
}

export default MyOrder;