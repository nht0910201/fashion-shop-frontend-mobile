import { Button, FormControl, HStack, Modal, Radio, TextArea, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import IconMUI from 'react-native-vector-icons/MaterialIcons'
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Warning from '../../components/Warning';
import Error from '../../components/Error';
import { review } from "../../services/ReviewService";
import { getUser } from "../../utils/userHandle";
import { useNavigation } from '@react-navigation/native';

function Reviews({productId}) {
    const navigation = useNavigation()
    const [userCur, setUser] = useState()
    useEffect(() => {
        async function getAuth() {
            const authUser = await getUser()
            setUser(authUser)
        }
        getAuth()
    }, [])
    const [modalVisible, setModalVisible] = React.useState(false);
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [loading, setLoad] = useState(false)
    const [content, setContent] = useState('')
    const [rate, setRate] = useState(5.0)
    const handleChangeContent = (e) => {
        setContent(e)
    }
    const handleChangeRate = (e) => {
        setRate(e)
    }
    const sendReview = async ({ content, productId, rate }) => {
        
        if (userCur?.id === undefined) {
            Warning('Vui lòng đăng nhập', 'Vui lòng nhấn OK')
        } else {
            if (content === '') {
                Warning('Vui lòng nhập ý kiến nhận xét','Vui lòng nhấn OK')
            } else {
                setLoad(true)
                let res = await review({ content, productId, rate })
                if (res.data.success) {
                    setLoad(false)
                    Success('Gửi nhận xét thành công','Vui lòng nhấn OK')
                } else {
                    setLoad(false)
                    Error('Gửi nhận xét không thành công')
                }
            }
        }
    }
    const handleClickSend = () => {
        sendReview({ content, productId, rate })
    }
    return (
        <AlertNotificationRoot>
            <Loading loading={loading} />
            <Button onPress={() => {
                setModalVisible(!modalVisible);
            }} variant={'solid'} colorScheme={'yellow'} borderRadius={'xl'} endIcon={<IconMUI name="feedback" size={20} />} size={'md'}>
                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>
                    Đánh giá
                </Text>
            </Button>
            <Modal isOpen={modalVisible} onClose={() => { setModalVisible(false); setContent(''), setRate(5.0) }} initialFocusRef={initialRef} finalFocusRef={finalRef}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>ĐÁNH GIÁ SẢN PHẨM</Modal.Header>
                    <Modal.Body>
                        <Radio.Group style={{ marginLeft: 0 }} value={rate} onChange={handleChangeRate} name="Star" accessibilityLabel="Pick Star">
                            <HStack>
                                <Radio style={{ paddingBottom: 5 }} colorScheme={'yellow'} isInvalid size={'lg'} value={1.0}>
                                    <HStack style={{ paddingRight: 10 }} justifyContent={'center'} alignItems={'center'}>
                                        <Text>
                                            1
                                        </Text>
                                        <IconMUI name='star' />
                                    </HStack>
                                </Radio>
                                <Radio style={{ paddingBottom: 5 }} colorScheme={'yellow'} isInvalid size={'lg'} value={2.0}>
                                    <HStack style={{ paddingRight: 10 }} justifyContent={'center'} alignItems={'center'}>
                                        <Text>
                                            2
                                        </Text>
                                        <IconMUI name='star' />
                                    </HStack>
                                </Radio>
                                <Radio style={{ paddingBottom: 5 }} colorScheme={'yellow'} isInvalid size={'lg'} value={3.0}>
                                    <HStack style={{ paddingRight: 10 }} justifyContent={'center'} alignItems={'center'}>
                                        <Text>
                                            3
                                        </Text>
                                        <IconMUI name='star' />
                                    </HStack>
                                </Radio>
                            </HStack>
                            <HStack>
                                <Radio style={{ paddingBottom: 5 }} colorScheme={'yellow'} isInvalid size={'lg'} value={4.0}>
                                    <HStack style={{ paddingRight: 10 }} justifyContent={'center'} alignItems={'center'}>
                                        <Text>
                                            4
                                        </Text>
                                        <IconMUI name='star' />
                                    </HStack>
                                </Radio>
                                <Radio style={{ paddingBottom: 5 }} colorScheme={'yellow'} isInvalid size={'lg'} value={5.0}>
                                    <HStack style={{ paddingRight: 10 }} justifyContent={'center'} alignItems={'center'}>
                                        <Text>
                                            5
                                        </Text>
                                        <IconMUI name='star' />
                                    </HStack>
                                </Radio>
                            </HStack>
                            <TextArea value={content} onChangeText={handleChangeContent} style={{ paddingTop: 10 }} h={40} placeholder="Nhập ý kiến nhận xét" w="100%" maxW="300" />
                        </Radio.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setModalVisible(false);
                                setContent('');
                                setRate(5.0)
                            }}>
                                Huỷ
                            </Button>
                            <Button onPress={handleClickSend}>
                                Gửi
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </AlertNotificationRoot>
    );
}

export default Reviews;