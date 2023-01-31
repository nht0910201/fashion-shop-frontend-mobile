import { Button, FormControl, HStack, Input, Modal } from "native-base";
import IconFA from 'react-native-vector-icons/FontAwesome'
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import React, { useState } from "react";
import validator from "validator";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import Warning from "../../components/Warning";
import { clearUser } from "../../utils/userHandle";
import { clearToken } from "../../utils/tokenHandle";
import SuccessNavigate from "../../components/SuccessNavigate";
import { useNavigation } from "@react-navigation/native";
import { LOGIN } from "../../constants/routes";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { changePassword } from "../../services/UserService";
import { Pressable } from "react-native";
export default function ModalChangePass({ id }) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = React.useState(false);
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoad] = useState(false)
    const [oldPassword, setoldPassword] = useState('')
    const [newPassword, setnewPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    const handleChangeoldPassword = (e) => {
        setoldPassword(e)
    }
    const handleChangenewPassword = (e) => {
        setnewPassword(e)
    }
    const handleChangeConfirmPass = (e) => {
        setConfirmPass(e)
    }
    const changePass = async () => {
        let oldPass = validator.isEmpty(oldPassword)
        let newPass = validator.isEmpty(newPassword)
        let confirm = validator.isEmpty(confirmPass)

        if (oldPass) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng nhập mật khẩu cũ')
        }
        else if (newPass) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng nhập mật khẩu mới')
        }
        else if (confirm) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng nhập lại mật khẩu mới')
        }
        else if (newPassword === oldPassword) {
            Error('Vui lòng nhập mật khẩu mới khác mật khẩu cũ')
        }
        else if (newPassword.length < 6) {
            Warning('THÔNG TIN KHÔNG HỢP LỆ', 'Vui lòng nhập mật khẩu mới có độ dài ít nhất 6 kí tự')
        }
        else if (newPassword !== confirmPass) {
            Error('Mật khẩu xác nhận không đúng với mật khẩu mới')
        }
        else {
            setLoad(true)
            let res = await changePassword({ oldPassword, newPassword }, id)
            if (res.success) {
                clearUser()
                clearToken()
                SuccessNavigate('ĐỔI MẬT KHẨU THÀNH CÔNG', 'Vui lòng nhấn OK', navigation, LOGIN)
            } else {
                Error('Đổi mật khẩu không thành công')
            }
        }

    }
    const handleSave = () => {
        changePass()
    }
    return <AlertNotificationRoot>
        <Loading loading={loading} />
        <Button onPress={() => {
            setModalVisible(!modalVisible);
        }} borderRadius={'3xl'}
            colorScheme={'blue'}
            size={'lg'}>
            Đổi mật khẩu
        </Button>
        <Modal isOpen={modalVisible} onClose={() => {setModalVisible(false);setoldPassword('');setnewPassword('');setConfirmPass('');}} initialFocusRef={initialRef} finalFocusRef={finalRef}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Đổi mật khẩu</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>Mật khẩu cũ</FormControl.Label>
                        <Input
                            variant={'rounded'}
                            ref={initialRef}
                            value={oldPassword}
                            onChangeText={handleChangeoldPassword}
                            type={showOld ? 'text' : 'password'}
                            InputRightElement={oldPassword.length === 0 ? '' :
                                <Pressable onPress={() => setShowOld(!showOld)}>
                                    <IconMUI name={showOld ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                </Pressable>}
                        />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Mật khẩu mới</FormControl.Label>
                        <Input
                            variant={'rounded'}
                            value={newPassword}
                            onChangeText={handleChangenewPassword}
                            type={showNew ? 'text' : 'password'}
                            InputRightElement={newPassword.length === 0 ? '' :
                                <Pressable onPress={() => setShowNew(!showNew)}>
                                    <IconMUI name={showNew ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                </Pressable>}
                        />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Xác nhận mật khẩu mới</FormControl.Label>
                        <Input
                            variant={'rounded'}
                            value={confirmPass}
                            onChangeText={handleChangeConfirmPass}
                            type={showConfirm ? 'text' : 'password'}
                            InputRightElement={confirmPass.length === 0 ? '' :
                                <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                    <IconMUI name={showConfirm ? "visibility" : "visibility-off"} size={20} style={{ marginRight: 10, padding: 5 }} color="muted.400" />
                                </Pressable>}
                        />
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setoldPassword('');
                            setnewPassword('');
                            setConfirmPass('');
                            setModalVisible(false);
                        }}>
                            Huỷ
                        </Button>
                        <Button onPress={handleSave}>
                            Lưu
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </AlertNotificationRoot>;
}