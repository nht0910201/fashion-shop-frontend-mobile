import React from "react";
import { Menu, Pressable, Divider } from "native-base";
import IconMUI from 'react-native-vector-icons/MaterialCommunityIcons'

export default function MenuCategories({ categories }) {
    return (
        <Menu closeOnSelect={false} w="190" trigger={triggerProps => {
            return <Pressable {...triggerProps}>
                <IconMUI name="menu" size={25} color={'white'} />
            </Pressable>;
        }}>
            {categories.map((category) => (
                <Menu.OptionGroup key={category.id} title={category.name} type="radio">
                    <Menu.ItemOption key={category.id} value={category.id}>{category.name}</Menu.ItemOption>
                    {category.subCategories.map((sub) => (
                        <Menu.ItemOption key={sub.id} value={sub.id}>{sub.name}</Menu.ItemOption>
                    ))}
                </Menu.OptionGroup>
            ))}

            {/* <Divider mt="3" w="100%" /> */}
        </Menu>
    )
}