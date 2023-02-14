import React from "react";
import { ScrollView, Text } from "react-native";
import { useRoute } from '@react-navigation/native';
import { Avatar, Box, Button, FormControl, HStack, Input, NativeBaseProvider, Radio, Spacer, VStack } from "native-base";
import { useState } from "react";
import { useEffect } from "react";
import { addProductToCart, getProductByID } from "../../services/ProductService";
import Loading from "../../components/Loading";
import { View, Dimensions } from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import "intl";
import "intl/locale-data/jsonp/en";
import { Badge } from "@rneui/themed";
import { getReviewsByProduct } from "../../services/ReviewService";
import { FlatList } from "react-native";
import Reviews from "./Reviews";
import Warning from "../../components/Warning";
import Success from "../../components/Success";
import Error from "../../components/Error";
import {getUser} from '../../utils/userHandle'

const width = Dimensions.get('window').width;

function ProductDetail() {
    const [userCur, setUser] = useState()
    useEffect(() => {
        async function getAuth() {
            const authUser = await getUser()
            setUser(authUser)
        }
        getAuth()
    }, [])
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const route = useRoute()
    const productId = route.params.productId
    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState()
    const [reviews, setReviews] = useState({});
    let [page, setPage] = useState(0);
    const [colorList, setColorList] = useState([]);
    const [color, setColor] = useState('');
    const [extraFee, setFee] = useState(0);
    const [productOptionId, setProductOptionId] = useState('');
    const [loadMore, setLoadMore] = useState(false);
    useEffect(() => {
        async function getData() {
            setLoading(true)
            const res = await getProductByID(productId)
            if (res.success) {
                setProduct(res.data)
                setProductOptionId(res.data.options[0].id);
                setColorList(res.data.options[0].variants);
                setColor(res.data.options[0].variants[0].color);
                setFee(res.data.options[0].extraFee);
                setLoading(false)
            }
        }
        getData()
    }, [])
    useEffect(()=>{
        async function getReviews() {
            setLoading(true)
            let reviews = await getReviewsByProduct(productId, page);
            if (reviews.success) {
                setReviews(reviews.data);
                setLoading(false)
            }
        }
        getReviews();
    },[page])
    const product_images = []
    product?.images?.map((image) => {
        product_images.push({ img: image.url })
    })
    const handleChangeSize = (e) => {
        setProductOptionId(e);
        product.options.forEach((option) => {
            if (option.id === e) {
                setColorList(option.variants);
                setColor(option.variants[0].color);
                setFee(option.extraFee);
            }
        });
    };
    const pagnition = []
    let x = 1
    for (let i = 0; i < reviews?.totalPage; i++) {
        pagnition.push(x)
        x++
    }
    const quantity = 1;
    const addToCart = async ({ productOptionId, color, quantity }) => {
        
        if (userCur?.id !== undefined) {
            setLoading(true)
            let res = await addProductToCart({ productOptionId, color, quantity });
            if (res.data.success) {
                setLoading(false)
                Success('Thêm sản phẩm vào giỏ hàng thành công','Vui lòng nhấn OK')
            } else {
                setLoading(false)
                Error('Thêm sản phẩm vào giỏ hàng thất bại')
            }
        } else {
            setLoading(false)
            Warning('Vui lòng đăng nhập', 'Vui lòng nhấn OK')
            
        }
    };
    const handleAddToCart = () => {
        addToCart({ productOptionId, color, quantity });
    };
    return (
        <NativeBaseProvider>
            <Loading loading={loading} />
            <ScrollView>
                <Text style={{ marginTop: 10, fontSize: 25, fontWeight: 'bold', textAlign: "center", color: 'black' }}>
                    {product?.name.toUpperCase()}
                </Text>
                <View style={{ marginTop: 10 }}>
                    <ImageSlider
                        data={product_images}
                        caroselImageStyle={{ height: width / 1.5 }}
                        showIndicator={true}
                        autoPlay={true}
                        timer={3000}
                        preview={true}
                    />
                </View>
                <Text style={{ textAlign: 'center', color: 'black' }}>Nhấn vào ảnh để phóng to</Text>
                {product?.discount <= 0 ?
                    <>
                        <HStack style={{ padding: 10 }} justifyContent={'space-between'} alignItems={'center'}>
                            <Text style={{ fontSize: 16, color: product?.state === 'enable' ? 'green' : 'red' }}>{product?.state === 'enable' ? 'Còn hàng' : 'Hết hàng'}</Text>
                            <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>{formatPrice(product?.discountPrice)}</Text>
                        </HStack>
                        <HStack justifyContent={'flex-end'}>
                            <Button variant={'solid'} colorScheme={'yellow'} borderRadius={'xl'} leftIcon={<IconFA5 name="cart-plus" size={20} />} size={'md'}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                    Thêm vào giỏ hàng
                                </Text>
                            </Button>
                        </HStack>
                    </>
                    :
                    <>
                        <HStack style={{ padding: 10 }} justifyContent={'space-between'} alignItems={'center'}>
                            <View>
                                {product?.discount > 0 ?
                                    <Text style={{ fontSize: 18, color: 'black', textDecorationLine: 'line-through' }}>{formatPrice(product?.price)}</Text>
                                    : <></>}
                            </View>
                            <View>
                                {product?.discount > 0 ?
                                    <Badge
                                        badgeStyle={{ width: 50, height: 30 }}
                                        status="error"
                                        value={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                            -{product?.discount}%</Text>}>
                                    </Badge>
                                    : <></>}
                            </View>
                            <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>{formatPrice(product?.discountPrice)}</Text>
                        </HStack>
                        <HStack style={{ paddingRight: 10 }} justifyContent={'space-between'} alignItems={'center'}>
                            <Text style={{ textAlign: 'right', paddingHorizontal: 10, fontSize: 18, fontWeight: 'bold', color: product?.state === 'enable' ? 'green' : 'red' }}>{product?.state === 'enable' ? 'Còn hàng' : 'Hết hàng'}</Text>
                            <Button onPress={handleAddToCart} variant={'solid'} colorScheme={'yellow'} borderRadius={'xl'} leftIcon={<IconFA5 name="cart-plus" size={20} />} size={'md'}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                                    Thêm vào giỏ hàng
                                </Text>
                            </Button>
                        </HStack>
                    </>
                }
                <Text style={{ paddingHorizontal: 10, paddingBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Chọn size: </Text>
                <Radio.Group value={productOptionId} onChange={handleChangeSize} name="Size" accessibilityLabel="Choose your size">
                    <HStack justifyContent={'space-around'} space={2} style={{ paddingHorizontal: 10 }}>
                        {product?.options?.map((option) => (
                            <Radio colorScheme={'yellow'} isInvalid={productOptionId === option.id ? true : false} size={'lg'} key={option.id} value={option.id} isDisabled={option.inStock <= 0 ? true : false}>
                                {option.name}
                            </Radio>
                        ))}
                    </HStack>
                </Radio.Group>
                <Text style={{ paddingHorizontal: 10, paddingBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Chọn màu: </Text>
                <Radio.Group value={color} onChange={setColor} name="Color" accessibilityLabel="Choose color">
                    <HStack justifyContent={'space-around'} space={2} style={{ paddingHorizontal: 10 }}>
                        {colorList.map((variant) => (
                            <Radio colorScheme={'yellow'} key={variant.id} value={variant.color} isInvalid={color === variant.color ? true : false} size={'lg'} isDisabled={variant.stock <= 0 ? true : false}>
                                <Badge
                                    badgeStyle={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: variant.color,
                                        borderColor: variant.color === '#ffffff' ? 'black' : '',
                                        borderStyle: 'solid',
                                        borderWidth: 1,
                                        marginRight: 3,
                                    }}
                                ></Badge>
                            </Radio>
                        ))}
                    </HStack>
                </Radio.Group>
                <Text style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Thông số sản phẩm: </Text>
                {product?.attr?.length === 0 ? (
                    <Text>Sản phẩm chưa có thông số</Text>
                ) :
                    product?.attr?.map((attr) => (
                        <View key={attr.id} style={{ paddingLeft: 15 }}>
                            <Text style={{ color: 'black', fontSize: 17 }}>- {attr.name}: {attr.val}</Text>
                        </View>
                    ))
                }
                <HStack style={{ paddingRight: 10 }} justifyContent={'space-between'} alignItems={'center'}>
                    <Text style={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5, fontSize: 16, fontWeight: 'bold', color: 'black' }}>Đánh giá sản phẩm </Text>
                    <Reviews productId={productId}/>
                </HStack>
                {reviews?.list?.length !== 0 ?
                    <Box borderBottomWidth="1" _dark={{
                        borderColor: "muted.50"
                    }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                        <FlatList
                            data={reviews?.list}
                            renderItem={({ item }) =>
                                <HStack space={[2, 3]} justifyContent="space-between" alignItems={'center'}>
                                    <Avatar size="48px" source={{
                                        uri: 'https://thumbs.dreamstime.com/b/anonymous-user-icon-black-silhouette-man-business-suit-question-mark-face-profile-picture-vector-illustration-89671074.jpg'
                                    }} />
                                    <VStack>
                                        <Text _dark={{
                                            color: "warmGray.50"
                                        }} color="coolGray.800" bold>
                                            Người dùng: {item.reviewedBy}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }}>
                                            {item.content}
                                        </Text>
                                        <Text color="coolGray.600" _dark={{
                                            color: "warmGray.200"
                                        }}>
                                            {item.rate}.0/5.0
                                        </Text>
                                    </VStack>
                                    <Spacer />
                                    <Text fontSize="xs" _dark={{
                                        color: "warmGray.50"
                                    }} color="coolGray.800" alignSelf="flex-start">
                                        {item.createdDate}
                                    </Text>
                                </HStack>
                            }
                            keyExtractor={item => item.id}
                        />
                    </Box>
                    : <Text>Sản phẩm chưa có thông số</Text>
                }
                <HStack style={{ marginTop: 10 }} space={1} alignItems='center' justifyContent={'center'}>
                    {pagnition?.length > 0 ?
                        pagnition.map((idx) => (
                            <Button
                                key={idx}
                                variant={idx - 1 === page ? 'solid' : 'subtle'}
                                colorScheme={idx - 1 === page ? 'danger' : 'gray'}
                                onPress={() => { setPage(idx - 1) }}
                            >
                                {idx}
                            </Button>
                        ))
                        : <></>}
                </HStack>
            </ScrollView>
        </NativeBaseProvider>
    );
}

export default ProductDetail;