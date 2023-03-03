import { Button, FormControl, HStack, Image, Input, Modal } from "native-base";
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useState } from "react";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Loading from "../../components/Loading";
import { AlertNotificationRoot } from 'react-native-alert-notification';
import { updateAvatarUserByID } from "../../services/UserService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Success from "../../components/Success";
import Error from "../../components/Error";
import { useNavigation } from '@react-navigation/native';

export default function ModalChangeAvatar({ user }) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoad] = useState(false)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState('')
    const navigate = useNavigation()

    const hanldeOpenLib = () => {
        launchImageLibrary({ mediaType: "photo" }, async (res) => {
            setFile(res.assets[0])
            setPreview(res.assets[0].uri)
        });
    }
    const updateAvatar = async () => {
        const data = new FormData();
        data.append('file', {
            uri: file.uri,
            type: file.type,
            name: file.fileName,
        });
        setLoad(true)
        let res = await updateAvatarUserByID(data, user.id)
        if (res.data.success) {
            await AsyncStorage.setItem('avatar', JSON.stringify(res.data.data.avatar));
            Success('CẬP NHẬT THÀNH CÔNG','Vui lòng nhấn nút Lưu')
            setModalVisible(false)
            setLoad(false)
        } else {
            Error('Cập nhật ảnh đại diện thất bại')
        }
    }
    const handleSaveAvatar = () => {
        updateAvatar()
    }
    return <AlertNotificationRoot>
        <Loading loading={loading} />
        <Button onPress={() => {
            setModalVisible(!modalVisible);
        }} variant={'unstyled'} size={'xs'} leftIcon={<IconMUI name='camera-flip' size={30} />}></Button>
        <Modal isOpen={modalVisible} onClose={() => { setModalVisible(false); setPreview(''); setFile(null) }} initialFocusRef={initialRef} finalFocusRef={finalRef}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Đổi ảnh đại diện</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <Image size={130} width={'full'} source={{
                            uri: preview === '' ? user?.avatar : preview
                        }} alt="Avatar..." />
                    </FormControl>
                    <Button onPress={hanldeOpenLib} variant={'unstyled'} size={'xs'} leftIcon={<IconMUI name='cloud-upload' size={30} />}></Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setModalVisible(false);
                            setPreview('')
                            setFile(null)
                        }}>
                            Huỷ
                        </Button>
                        <Button onPress={handleSaveAvatar}>
                            Lưu
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </AlertNotificationRoot>;
}