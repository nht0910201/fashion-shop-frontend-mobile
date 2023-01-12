import { Button, FormControl, HStack, Input, Modal } from "native-base";
import IconFA from 'react-native-vector-icons/FontAwesome'
import React from "react";
export default function ModalChangePass() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    return <>
        <Button onPress={() => {
            setModalVisible(!modalVisible);
        }} borderRadius={'3xl'}
            endIcon={<IconFA name="refresh" size={25} />}
            colorScheme={'blue'}
            size={'lg'}>
            Đổi mật khẩu
        </Button>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef}>
            <Modal.Content>
                <Modal.CloseButton />
                <Modal.Header>Đổi mật khẩu</Modal.Header>
                <Modal.Body>
                    <FormControl>
                        <FormControl.Label>Mật khẩu cũ</FormControl.Label>
                        <Input variant={'rounded'} ref={initialRef} />
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Mật khẩu mới</FormControl.Label>
                        <Input variant={'rounded'}/>
                    </FormControl>
                    <FormControl mt="3">
                        <FormControl.Label>Xác nhận mật khẩu mới</FormControl.Label>
                        <Input variant={'rounded'}/>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group space={2}>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                            setModalVisible(false);
                        }}>
                            Huỷ
                        </Button>
                        <Button onPress={() => {
                            setModalVisible(false);
                        }}>
                            Lưu
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    </>;
}