import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const Home = () => {
  const route = useRoute()
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Home!</Text>
      <Text>Id: {route.params?.id} </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
