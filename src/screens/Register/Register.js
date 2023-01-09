import React from 'react';
import { SafeAreaView, ScrollView, View, Text,Pressable } from 'react-native';
import { styles } from './styles';
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { useState } from "react";
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import { NativeBaseProvider, Input, Stack, Button } from "native-base";
import { Select } from "native-base";

function Register() {
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const handleChangePassword = (e) => {
        setPassword(e)
    }
    const handleChangeConfirm = (e) => {
        setConfirm(e)
    }
    return (
        <NativeBaseProvider>
            <AlertNotificationRoot>
                <SafeAreaView style={styles.container}>
                    <ScrollView style={{ width: '98%' }}>
                        <View style={styles.title}>
                            {/* <IconFA5 name={'user-plus'} size={50} /> */}
                            <Text style={{
                                fontSize: 23,
                                textAlign: 'center',
                                color: '#f5a524',
                                fontWeight: 'bold',
                            }}>Đăng ký</Text>
                        </View>
                        <View style={styles.content}>
                            <Stack space={4} w="100%" alignItems="center">
                                <Input
                                    placeholder="Tên"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                // value={username}
                                // onChangeText={handleChangeUsername}
                                />
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Giới tính"
                                    placeholder="Giới tính"
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Nam" value="male" />
                                    <Select.Item label="Nữ" value="female" />
                                </Select>
                                <Input
                                    placeholder="Email"
                                    variant={'rounded'}
                                    size={'2xl'}
                                    style={{ margin: 5 }}
                                />
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Tỉnh/Thành phố"
                                    placeholder="Tỉnh/Thành phố"
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Tỉnh" value="Thành phố" />
                                </Select>
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Quận/Huyện"
                                    placeholder="Quận/Huyện"
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Quận" value="Huyện" />
                                </Select>
                                <Select
                                    variant="rounded"
                                    width={"100%"}
                                    size={'xl'}
                                    accessibilityLabel="Xã/PHường"
                                    placeholder="Xã/PHường"
                                    style={{ margin: 5 }}
                                    _selectedItem={{
                                        bg: "teal.600",
                                        endIcon: <IconMUI name="arrow-down-plus" size={5} />
                                    }} mt={1}>
                                    <Select.Item label="Xã" value="Phường" />
                                </Select>
                                <Input
                                    placeholder="Địa chỉ"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                />
                                <Input
                                    placeholder="Số điện thoại"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ margin: 5 }}
                                />
                                <Input
                                    type={showPass ? "text" : "password"}
                                    InputRightElement={password.length === 0 ? '' :
                                        <Pressable onPress={() => setShowPass(!showPass)}>
                                            <IconMUI name={showPass ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                        </Pressable>
                                    }
                                    placeholder="Mật khẩu"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ marginHorizontal: 5, marginVertical: 5 }}
                                    value={password}
                                    onChangeText={handleChangePassword}
                                />
                                <Input
                                    type={showConfirm ? "text" : "password"}
                                    InputRightElement={password.length === 0 ? '' :
                                        <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                            <IconMUI name={showConfirm ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                        </Pressable>
                                    }
                                    placeholder="Nhập lại mật khẩu"
                                    variant={'rounded'}
                                    size={'xl'}
                                    style={{ marginHorizontal: 5, marginVertical: 5 }}
                                    value={confirm}
                                    onChangeText={handleChangeConfirm}
                                />
                            </Stack>
                            <Button
                                variant="solid"
                                size={'lg'}
                                // onPress={handleLogin}
                                bgColor={'#f5a524'}
                                style={{ margin: 10, width: '98%', borderRadius: 55 }}
                            >
                                Đăng ký
                            </Button>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </AlertNotificationRoot>
        </NativeBaseProvider>
    );
}

export default Register;