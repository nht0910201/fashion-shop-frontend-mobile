import React from "react";
import { Popover, Button, VStack, Text } from "native-base";
import IconEntypo from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import { PRODUCT_LIST } from "../../constants/routes";
import { useState } from "react";

export default function MenuCategories({ categories }) {
    const navigation = useNavigation()
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Popover
            placement={'bottom left'} trigger={triggerProps => {
                return <Button variant={'unstyled'} endIcon={<IconEntypo name="menu" size={25} />} colorScheme="dark" alignSelf="center" {...triggerProps} onPress={() => setIsOpen(true)}>
                </Button>;

            }} isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
            <Popover.Content w="56">
                <Popover.Arrow />
                <Popover.CloseButton onPress={() => setIsOpen(false)} />
                <Popover.Header>Danh mục sản phẩm</Popover.Header>
                <Popover.Body>
                    <VStack space={2} alignItems="flex-start">
                        {categories.map((category) => (
                            <>
                                <Button key={category.id} variant="ghost" onPress={()=>navigation.navigate(PRODUCT_LIST,{catId:category.id,catName:category.name})}>
                                    <Text textAlign={'center'} fontSize={18} fontWeight={'bold'}>{category.name}</Text>
                                </Button>
                                <VStack space={1} alignItems={'flex-start'} style={{ marginLeft: 20 }}>
                                    {category.subCategories.map((sub) => (
                                        <Button key={sub.id} variant="ghost" onPress={()=>navigation.navigate(PRODUCT_LIST,{catId:sub.id,catName:sub.name})}>
                                            <Text textAlign={'center'} fontSize={16}>{sub.name}</Text>
                                        </Button>
                                    ))}
                                </VStack>
                            </>
                        ))}
                    </VStack>
                </Popover.Body>
                <Popover.Footer justifyContent="flex-end">
                    <Button.Group>
                        <Button colorScheme="red" variant="ghost" onPress={() => setIsOpen(false)}>
                            Đóng
                        </Button>
                    </Button.Group>
                </Popover.Footer>
            </Popover.Content>
        </Popover>
    )
}