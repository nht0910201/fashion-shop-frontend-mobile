import React from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import "intl";
import "intl/locale-data/jsonp/en";
import { useState } from "react";
import { useEffect } from "react";
import { getCart } from "../../services/CartService";
import { Button, HStack, Input, NativeBaseProvider, VStack } from "native-base";
import Loading from "../../components/Loading";
import { FlatList } from "react-native";
import { View } from "react-native";
import { Badge, Card } from "@rneui/themed";
import { addProductToCart } from "../../services/ProductService";
import Success from "../../components/Success";
import Warning from "../../components/Warning";
import Error from "../../components/Error";
import { getUser } from '../../utils/userHandle'
import { useNavigation } from '@react-navigation/native';
import { MAKE_ORDER } from "../../constants/routes";

function ShoppingCart() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [userCur, setUser] = useState()
    useEffect(() => {
        async function getAuth() {
            const authUser = await getUser()
            setUser(authUser)
        }
        getAuth()
    }, [])
    const [cart, setCart] = useState({});
    const [cartLoad, setCartLoad] = useState(false);
    useEffect(() => {
        async function getData() {
            setLoading(true)
            let res = await getCart();
            if (res.success) {
                if (res.data.totalProduct === 0) {
                    setCart('404')
                    setLoading(false)
                } else {
                    setCart(res.data);
                    setLoading(false)
                }
            }
            else {
                setCart('404')
                setLoading(false)
            }
        }
        getData();
    }, [cartLoad]);
    const updateChangeCart = (productOptionId, color, quantity) => {
        if (quantity !== 0 && typeof quantity === 'number') {
            updateCart({ productOptionId, color, quantity });
        }
    };

    const updateCart = async ({ productOptionId, color, quantity }) => {
        setLoading(true)
        if (userCur?.id !== undefined) {
            let res = await addProductToCart({ productOptionId, color, quantity });
            if (res.data.success) {
                setCartLoad(!cartLoad);
                Success('Cập nhật giỏ hàng thành công')
            } else {
                if (res.data.status === 409) {
                    Warning('Quá số lượng sản phẩm hiện có', ' Vui lòng chọn số lượng khác')
                } else {
                    Error('Cập nhật giỏ hàng không thành công')
                }
            }
        }
        else {
            Error('Vui lòng đăng nhập')
        }
    };
    return (
        <NativeBaseProvider>
            <Loading loading={loading} />
            <ScrollView>
                <HStack justifyContent={'space-between'}>
                    <Text style={{ fontSize: 18, color: 'black', padding: 10 }}>Giỏ hàng của bạn</Text>
                    <Text style={{ fontSize: 18, color: 'black', padding: 10 }}> {cart?.totalProduct || 0} sản phẩm</Text>
                </HStack>
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
                                                <Button.Group isAttached colorScheme="blue" mx={{
                                                    base: "auto",
                                                    md: 0
                                                }} size="sm">
                                                    <Button
                                                        variant="outline"
                                                        colorScheme={'red'}
                                                        size={'lg'}
                                                        onPress={() => updateChangeCart(item.productOptionId, item.color, -1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Input
                                                        value={item.quantity.toString()}
                                                        size='2xl'
                                                        w={'12'}
                                                        onBlur={(e) => {
                                                            if (e <= 0) {
                                                                Warning('Số lượng không hợp lệ', 'Vui lòng nhập lại')
                                                            } else {
                                                                updateChangeCart(
                                                                    item.productOptionId,
                                                                    item.color,
                                                                    e - cartItem.quantity,
                                                                )
                                                            }
                                                        }
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size={'lg'}
                                                        colorScheme={'red'}
                                                        onPress={() => updateChangeCart(item.productOptionId, item.color, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </Button.Group>
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
                            {cart?.totalPrice !== undefined ?
                                <View style={{padding:15}}>
                                    <Text style={{color:'black',fontSize:22}}>Tổng số tiền: {formatPrice(cart?.items.reduce((total, cur) => total + (cur.price * cur.quantity), 0)) || 0}</Text>
                                    <Text style={{color:'black',fontSize:22}}>Giảm giá: {formatPrice(cart?.items.reduce((total, cur) => total + (cur.price * cur.quantity), 0) - cart?.totalPrice) || 0}</Text>
                                    <Text style={{color:'black',fontSize:22,fontWeight:'bold'}}>Thanh toán: {formatPrice(cart?.totalPrice || 0)}</Text>
                                </View>
                                :
                                <></>
                            }
                            <Button isDisabled={cart === '404' ? true : false} onPress={()=>navigation.navigate(MAKE_ORDER)} variant={'solid'} borderRadius={'3xl'} size={'lg'} colorScheme={'yellow'}>Đặt hàng</Button>
                        </>
                    }
                </View>
            </ScrollView>
        </NativeBaseProvider>
    );
}

export default ShoppingCart;