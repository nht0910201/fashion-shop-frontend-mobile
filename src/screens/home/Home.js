import { Header, SearchBar } from '@rneui/themed';
import { Input, NativeBaseProvider, VStack, Icon, Button, Image } from 'native-base';
import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import MenuCategories from './MenuCategories';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import { styles } from './styles';
import { getAllCategory } from '../../services/CategoryService';
import { ImageSlider } from "react-native-image-slider-banner";
import Loading from '../../components/Loading';

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
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  useEffect(() => {
    async function getCategories() {
      setLoading(true)
      let Categories = await getAllCategory();
      if (Categories.success) {
        setLoading(false)
        setCategories(Categories.data)
      }
    }
    getCategories()
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
              />
            </VStack>
          }
          rightComponent={<Button
            borderRadius={'3xl'}
            leftIcon={<IconFA5 name="search" size={20} />}
            colorScheme={'black'}
            size={'md'}>
          </Button>}
        />
        <View style={{ marginTop: 0 }}>
          <ImageSlider
            data={slider}
            caroselImageStyle={{height:width/2.5}}
            showIndicator={true}
            autoPlay={true}
            timer={3000}
            preview={false}
          />
        </View>
        <Text>Sản phẩm hot</Text>
        <Text>Sản phẩm mới</Text>
      </ScrollView>
    </NativeBaseProvider>

  );
};

export default Home;


