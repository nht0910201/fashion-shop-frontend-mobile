import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('accessToken', token)
  } catch (e) {
    console.log(e)
  }
}

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken')
    if (token !== null) {
      return token
    }
  } catch (e) {
    console.log(e)
  }
}

export const clearToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken')
    if (token !== null) {
      await AsyncStorage.removeItem('accessToken')
    }
  } catch (e) {
    console.log(e)
  }
}