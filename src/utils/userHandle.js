import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (id, email, name, avatar, role) => {
    try {
        await AsyncStorage.setItem('id', id)
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('name', name)
        await AsyncStorage.setItem('avatar', avatar)
        await AsyncStorage.setItem('role', role)
    } catch (e) {
        console.log(e)
    }
}

export const getUser = async () => {
    try {
        let user = {
            id: "",
            email: "",
            name: "",
            avatar: "",
            role: ""
        }
        const curId = await AsyncStorage.getItem('id');
        const curEmail = await AsyncStorage.getItem('email');
        const curName = await AsyncStorage.getItem('name');
        const curAvatar = await AsyncStorage.getItem('avatar');
        const curRole = await AsyncStorage.getItem('role');
        if (curId && curEmail && curName && curAvatar  && curRole) {
            user = { id: curId, email: curEmail, name: curName, avatar: curAvatar, role: curRole }
            return user
        }
        else {
            console.log("Get user failed")
        }
    } catch (e) {
        console.log(e)
    }
}
export const clearUser = async () => {
    try {
        const curId = await AsyncStorage.getItem('id');
        const curEmail = await AsyncStorage.getItem('email');
        const curName = await AsyncStorage.getItem('name');
        const curAvatar = await AsyncStorage.getItem('avatar');
        const curRole = await AsyncStorage.getItem('role');
        if (curId && curEmail && curName && curAvatar && curRole) {
            await AsyncStorage.removeItem('id')
            await AsyncStorage.removeItem('email')
            await AsyncStorage.removeItem('name')
            await AsyncStorage.removeItem('avatar')
            await AsyncStorage.removeItem('role')
        }
    } catch (e) {
        console.log(e)
    }
}