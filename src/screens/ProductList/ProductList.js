import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native";
import { getProductByCategory, searchProduct } from './../../services/ProductService';
import { useRoute, useNavigation } from '@react-navigation/native';
import Loading from "../../components/Loading";
import { PRODUCT_DETAIL } from "../../constants/routes";
import { Box, Button, Checkbox, Heading, HStack, NativeBaseProvider, Popover, Radio, Slider } from "native-base";
import { FlatList } from "react-native";
import { Badge, Card } from "@rneui/themed";
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'
import "intl";
import "intl/locale-data/jsonp/en";
import { filter } from 'smart-array-filter'

function ProductList() {
    const route = useRoute()
    const navigation = useNavigation()
    const isSearch = route.params.find;
    const formatPrice = (value) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [filterProduct, setFilter] = useState([])
    const [totalPage, setTotalPage] = useState(0)
    let [page, setPage] = useState(0)
    async function getData(sort = '') {
        setLoading(true)
        if (isSearch) {
            let res = await searchProduct(route.params.search, sort)
            // console.log(res)
            if (res.success) {
                setProducts(res.data)
                setFilter(res.data.list)
                setTotalPage(res.data.totalPage)
                filterPrice(res.data.list)
                setLoading(false)
            }
        } else {
            let res = await getProductByCategory(route.params.catId, page, sort)
            // console.log(res)
            if (res.success) {
                setProducts(res.data)
                setFilter(res.data.list)
                setTotalPage(res.data.totalPage)
                filterPrice(res.data.list)
                setLoading(false)
            }
        }
    }

    const sortArr = [
        { name: '', val: 'Nổi bật' },
        { name: 'new', val: 'Mới nhất' },
        { name: 'discount', val: "% giảm giá" },
        { name: 'priceAsc', val: 'Giá thấp đến cao' },
        { name: 'priceDesc', val: 'Giá cao đến thấp' }
    ]
    const [sort, setSort] = useState('')
    const [sortPro, setSortPro] = useState('')
    useEffect(() => {
        getData(sortPro)
    }, [page, sortPro])
    const sortProduct = (key) => {
        switch (key) {
            case 'discount':
                setSortPro('discount,desc')
                break;
            case 'priceAsc':
                setSortPro('price,asc')
                break;
            case 'priceDesc':
                setSortPro('price,desc')
                break;
            case 'new':
                setSortPro('createdDate,desc')
                break;
            default:
                setSortPro('')
                break;
        }
    }
    const [value, setValue] = useState(5000000);

    const handleChangeValue = (e) => {
        setValue(e);
    };
    const [gender, setGender] = useState([])
    const [col, setCol] = useState([])
    const filterPrice = (list) => {
        let arr = products.list
        if (list?.length > 0) {
            arr = list
        }

        arr = filter(arr, {
            keywords: `discountPrice:${100000}..${value}`
        });
        if (gender.length > 0) {
            arr = filter(arr, {
                keywords: `attr.val:${gender}`
            })
        }
        if (col.length > 0) {
            arr = filter(arr, {
                keywords: `images.color:${col}`
            })
        }

        if (arr.length > 0) {
            setFilter(arr)
        }
    }
    const resetFilter = () => {
        setCol([])
        setValue(5000000)
        setGender([])
        setFilter(products.list)
    }

    const [isOpen1, setIsOpen1] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const pagnition = []
    let x = 1
    for (let i = 0; i < totalPage; i++) {
        pagnition.push(x)
        x++
    }
    return (
        <NativeBaseProvider>
            <ScrollView>
                <Loading loading={loading} />
                <Box>
                    <Heading fontSize="xl" p="4" pb="3" style={{ textAlign: 'center' }}>
                        {isSearch ? 'Kết quả tìm kiếm: ' + route.params.search : 'Danh sách sản phẩm: ' + route.params.catName}
                    </Heading>
                    <HStack justifyContent={'center'}>
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
                                    <Text>Giá: {formatPrice(100000)} - {formatPrice(value)}</Text>
                                    <Slider size="sm" value={value} onChange={handleChangeValue} minValue={100000} maxValue={5000000} step={50000}>
                                        <Slider.Track>
                                            <Slider.FilledTrack />
                                        </Slider.Track>
                                        <Slider.Thumb />
                                    </Slider>
                                    <Text>Giới tính:</Text>
                                    <Checkbox.Group onChange={(e) => setGender(e)} value={gender} accessibilityLabel="Gender">
                                        <Checkbox value="nam">
                                            Nam
                                        </Checkbox>
                                        <Checkbox value="nữ">Nữ</Checkbox>
                                    </Checkbox.Group>
                                    <Text>Màu sắc:</Text>
                                    <Checkbox.Group onChange={(e) => setCol(e)} value={col} accessibilityLabel="Colors">
                                        <Checkbox value="#ffffff">
                                            <Badge badgeStyle={{ width: 15, height: 15, backgroundColor: 'white', borderColor: 'black', borderStyle: 'solid', borderWidth: 1 }} />
                                        </Checkbox>
                                        <Checkbox value="#000000">
                                            <Badge badgeStyle={{ width: 15, height: 15, backgroundColor: 'black', borderColor: 'black', borderStyle: 'solid', borderWidth: 1 }} />
                                        </Checkbox>
                                    </Checkbox.Group>
                                </Popover.Body>
                                <Popover.Footer justifyContent="flex-end">
                                    <Button.Group space={2}>
                                        <Button colorScheme="coolGray" variant="ghost" onPress={resetFilter}>
                                            Xoá bộ lọc
                                        </Button>
                                        <Button colorScheme="danger" onPress={filterPrice}>
                                            Xem kết quả
                                        </Button>
                                    </Button.Group>
                                </Popover.Footer>
                            </Popover.Content>
                        </Popover>
                        <Popover
                            placement={'bottom left'} trigger={triggerProps => {
                                return <Button variant={'outline'} alignSelf="center" {...triggerProps} onPress={() => setIsOpen2(true)}>
                                    <Text>
                                        <IconMUI name="sort" size={25}/> {sortArr.filter((item) => {
                                            return item.name === sort
                                        })[0].val}
                                    </Text>
                                </Button>;
                            }} isOpen={isOpen2} onClose={() => setIsOpen2(!isOpen2)}>
                            <Popover.Content w="56">
                                <Popover.Arrow />
                                <Popover.CloseButton onPress={() => setIsOpen2(false)} />
                                <Popover.Header>Sắp xếp</Popover.Header>
                                <Popover.Body>
                                    <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={sort} onChange={(key) => { setSort(key); sortProduct(key) }}>
                                        {sortArr.map((item) => (
                                            <Radio value={item.name} size={'md'} isInvalid style={{ marginVertical: 3 }}>
                                                {item.val}
                                            </Radio>
                                        ))}
                                    </Radio.Group>;
                                </Popover.Body>
                            </Popover.Content>
                        </Popover>
                    </HStack>
                    {filterProduct?.length === 0 ? <Text style={{marginTop:20,textAlign:'center',fontSize:18,fontWeight:'bold'}}>
                        Không tìm thấy sản phẩm nào
                    </Text> :
                        <>
                            <FlatList
                                data={filterProduct}
                                renderItem={({ item }) =>
                                    <Card key={item.id}>
                                        <Card.Title onPress={() => navigation.navigate(PRODUCT_DETAIL, { productId: item.id })} style={{ fontSize: 18 }}>{item.name}</Card.Title>
                                        <Card.Divider />
                                        <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8,width: 50, height: 30 } : {}} status={item.discount > 0 ? 'error' : ''} />
                                        <Card.Image
                                            style={{ padding: 0 }}
                                            source={{
                                                uri:
                                                    item.images[0]?.url
                                            }}
                                            onPress={() => navigation.navigate(PRODUCT_DETAIL, { productId: item.id })}
                                        />
                                        <HStack justifyContent={'space-between'}>
                                            <Text style={{ fontSize: 18, marginBottom: 10, textDecorationLine: 'line-through' }}>
                                                {item.discount > 0 ? formatPrice(item.price) : ''}
                                            </Text>
                                            <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>
                                                {formatPrice(item.discountPrice)}
                                            </Text>
                                        </HStack>
                                        <HStack justifyContent={'space-between'}>
                                            <HStack>
                                                {item.images.map((image) => (
                                                    <Badge
                                                        badgeStyle={{
                                                            width: 20,
                                                            height: 20,
                                                            backgroundColor: image.color,
                                                            borderColor: image.color === '#ffffff' ? 'black' : '',
                                                            borderStyle: 'solid',
                                                            borderWidth: 1,
                                                            marginRight: 3,
                                                        }}
                                                    ></Badge>
                                                ))}
                                            </HStack>
                                            <Text style={{ fontSize: 18 }}>
                                                {item.rate <= 0 ? 'Chưa có đánh giá' : <>{item.rate}<Ionicons name='star' size={18} color={'black'} /></>}
                                            </Text>
                                        </HStack>
                                    </Card>
                                }
                                keyExtractor={item => item.id}
                            />
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
                        </>
                    }
                </Box>
            </ScrollView>
        </NativeBaseProvider>

    );
}

export default ProductList;