import { Header, Card, Badge } from '@rneui/themed';
import { Input, NativeBaseProvider, VStack, Icon, Button, HStack, Box, Heading, FlatList, Center } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import MenuCategories from './MenuCategories';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { styles } from './styles';
import { getAllCategory } from '../../services/CategoryService';
import { ImageSlider } from "react-native-image-slider-banner";
import Loading from '../../components/Loading';
import { getSortProducts } from '../../services/ProductService';
import "intl";
import "intl/locale-data/jsonp/en";
import { useNavigation } from '@react-navigation/native';
import { PRODUCT_DETAIL, PRODUCT_LIST } from '../../constants/routes';
import { getRecommendProducts } from '../../services/UserService';

const width = Dimensions.get('window').width;
const slider = [
  { img: 'https://file.hstatic.net/1000184601/file/banner_d63b88808e864ec4a5174b34be8a029c.jpg' },
  { img: 'https://file.hstatic.net/1000184601/collection/essential2_cb462794e7e84a9cbf5400f5f8bc73f0.jpg' },
  { img: 'https://file.hstatic.net/1000184601/collection/banner_men_bdabcc70837a405389d87942821ff2e6.jpg' },
  { img: 'https://file.hstatic.net/1000184601/collection/banner_women_71d0e5bced414bdc9d1ecc2fedd924a7.jpg' },
  { img: 'https://file.hstatic.net/1000184601/collection/banner_outerwear_776b99c3343c45a79d9f0782c2b8bbb8.jpg' },
  { img: 'https://file.hstatic.net/1000184601/file/cover_pc_53d8b9fe80db4553a3a748cb20b5f9d2.jpg' },
];

const Home = () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const handleSearchChange = (e) => {
    setSearch(e)
  }
  const [categories, setCategories] = useState([])
  const formatPrice = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  const [hotProduct, setHotProduct] = useState([]);
  const [newProduct, setNewProduct] = useState([]);
  const [recommends, setRecommends] = useState([]);
  const [loadMore1, setLoadMore1] = useState(false);
  const handleLoadMore1 = () => {
    setLoadMore1(!loadMore1);
  };
  const [loadMore2, setLoadMore2] = useState(false);
  const handleLoadMore2 = () => {
    setLoadMore2(!loadMore2);
  };
  const [loadMore3, setLoadMore3] = useState(false);
  const handleLoadMore3 = () => {
    setLoadMore3(!loadMore3);
  };
  useEffect(() => {
    async function getCategories() {
      setLoading(true)
      let Categories = await getAllCategory();
      if (Categories.success) {
        setCategories(Categories.data)
      }
    }
    async function getHotProduct() {
      let [resHot, resNew, recommend] = await Promise.all([
        getSortProducts('discount,desc'),
        getSortProducts('createdDate,desc'),
        getRecommendProducts()
      ]);
      if (resHot.success && resNew.success) {
        setHotProduct(resHot.data.list);
        setNewProduct(resNew.data.list);
        setRecommends(recommend.data)
        setLoading(false)
      }
    }
    getCategories();
    getHotProduct();
  }, []);
  return (
    <NativeBaseProvider>
      <Loading loading={loading} />
      <ScrollView style={styles.container}>
        <Header centerContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          rightContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          leftContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          backgroundColor='#f5a524'
          leftComponent={<MenuCategories categories={categories} />}
          centerComponent={
            <VStack w="100%" space={3} alignSelf="center">
              <Input
                size={'lg'}
                placeholder="Tìm kiếm"
                variant="filled"
                width="100%"
                borderRadius="10"
                py="1"
                px="2"
                InputLeftElement={<Icon ml="2" size="4" color="gray.400" as={<Ionicons name="ios-search" />} />}
                value={search}
                onChangeText={handleSearchChange}
              />
            </VStack>
          }
          rightComponent={<Button
            borderRadius={'3xl'}
            leftIcon={<IconFA5 name="search" size={20} />}
            colorScheme={'black'}
            size={'md'}
            onPress={() => navigation.navigate(PRODUCT_LIST, { find: true, search: search })}
          >
          </Button>}
        />
        <View style={{ marginTop: 0 }}>
          <ImageSlider
            data={slider}
            caroselImageStyle={{ height: width / 2.5 }}
            showIndicator={true}
            autoPlay={true}
            timer={3000}
            preview={false}
          />
        </View>
        <HStack justifyContent={'center'} space={1}>
          <Card wrapperStyle={{ width: width / 3 }}>
            <Card.Title h4>ÁO</Card.Title>
            {/* <Card.Divider /> */}
            <Card.Image
              style={{ padding: 0, marginBottom: 10, resizeMode: 'cover' }}
              source={{
                uri:
                  'https://file.hstatic.net/1000184601/file/banner-chang-trai-phong-cach-2_3ab47ea32b494c49b31a4213620efafa.jpg',
              }}
            />
            <Button onPress={() => navigation.navigate(PRODUCT_LIST, { catId: '630f3e661fbd7419759f5d71', catName: 'Áo' })} borderRadius={'3xl'} colorScheme={'blue'} te size={'md'}>
              Xem ngay !
            </Button>
          </Card>
          <Card wrapperStyle={{ width: width / 3 }}>
            <Card.Title h4>QUẦN</Card.Title>
            {/* <Card.Divider /> */}
            <Card.Image
              style={{ padding: 0, marginBottom: 10, resizeMode: 'cover' }}
              source={{
                uri:
                  'https://file.hstatic.net/1000184601/file/banner-chang-trai-phong-cach_4442b04c22a9445b8f12212386978bda.jpg',
              }}
            />
            <Button onPress={() => navigation.navigate(PRODUCT_LIST, { catId: '630f3e9d1fbd7419759f5d73', catName: 'Quần' })} borderRadius={'3xl'} colorScheme={'blue'} te size={'md'}>
              Xem ngay !
            </Button>
          </Card>
        </HStack>
        <Box>
          <Heading fontSize="2xl" p="4" pb="3" style={{ textAlign: 'center' }}>
            SẢN PHẨM HOT
          </Heading>
          <FlatList
            data={loadMore1 ? hotProduct : hotProduct.slice(0, 4)}
            renderItem={({ item }) =>
              <Card key={item.id}>
                <Card.Title onPress={() => navigation.navigate(PRODUCT_DETAIL, { productId: item.id })} style={{ fontSize: 18 }}>{item.name}</Card.Title>
                <Card.Divider />
                <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8, width: 50, height: 30 } : {}} status={item.discount > 0 ? 'error' : ''} />
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
                {/* <Button onPress={navigation.navigate(PRODUCT_DETAIL,{productId:item.id})}>Xem</Button> */}
              </Card>
            }
            keyExtractor={item => item.id}
          />
          <Button size={'lg'} variant={'unstyled'} onPress={handleLoadMore1}>
            {loadMore1 ? 'Thu gọn' : 'Xem thêm...'}
          </Button>
        </Box>
        <Box>
          <Heading fontSize="2xl" p="4" pb="3" style={{ textAlign: 'center' }}>
            SẢN PHẨM MỚI
          </Heading>
          <FlatList
            data={loadMore2 ? newProduct : newProduct.slice(0, 4)}
            renderItem={({ item }) =>
              <Card key={item.id}>
                <Card.Title onPress={() => navigation.navigate(PRODUCT_DETAIL, { productId: item.id })} style={{ fontSize: 18 }}>{item.name}</Card.Title>
                <Card.Divider />
                <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8, width: 50, height: 30 } : {}} status={item.discount > 0 ? 'error' : ''} />
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
                  <Text style={{ fontSize: 16 }}>
                    {item.rate <= 0 ? 'Chưa có đánh giá' : <>{item.rate}<Ionicons name='star' size={18} color={'black'} /></>}
                  </Text>
                </HStack>
              </Card>
            }
            keyExtractor={item => item.id}
          />
          <Button size={'lg'} variant={'unstyled'} onPress={handleLoadMore2}>
            {loadMore2 ? 'Thu gọn' : 'Xem thêm...'}
          </Button>
        </Box>
        <Box>
            <Heading fontSize="2xl" p="4" pb="3" style={{ textAlign: 'center' }}>
              SẢN PHẨM GỢI Ý CHO BẠN
            </Heading>
            <FlatList
              data={loadMore3 ? recommends : recommends.slice(0, 4)}
              renderItem={({ item }) =>
                <Card key={item.id}>
                  <Card.Title onPress={() => navigation.navigate(PRODUCT_DETAIL, { productId: item.id })} style={{ fontSize: 18 }}>{item.name}</Card.Title>
                  <Card.Divider />
                  <Badge value={item.discount > 0 ? -item.discount + '%' : ''} badgeStyle={item.discount > 0 ? { marginBottom: 8, width: 50, height: 30 } : {}} status={item.discount > 0 ? 'error' : ''} />
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
                    <Text style={{ fontSize: 16 }}>
                      {item.rate <= 0 ? 'Chưa có đánh giá' : <>{item.rate}<Ionicons name='star' size={18} color={'black'} /></>}
                    </Text>
                  </HStack>
                </Card>
              }
              keyExtractor={item => item.id}
            />
            <Button size={'lg'} variant={'unstyled'} onPress={handleLoadMore3}>
              {loadMore3 ? 'Thu gọn' : 'Xem thêm...'}
            </Button>
          </Box>
      </ScrollView>
    </NativeBaseProvider>

  );
};

export default Home;


