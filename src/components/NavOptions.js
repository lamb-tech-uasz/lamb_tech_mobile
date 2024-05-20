import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw  from 'twrnc';
import { Icon } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../../slices/navSlice';
const data = [
    {
        id: "123",
        title: "Get a Ride",
        image: "https://links.papareact.com/3pn",
        screen: "Location"
    },
    {
        id: "456",
        title: "Order food",
        image: "https://links.papareact.com/28w",
        screen: "Order"
    }
]
const NavOptions = () => {
    const naviagtion = useNavigation()
    const origin = useSelector(selectOrigin)
    return (
        <FlatList
            data={data}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={
                ({ item }) => (
                    <TouchableOpacity
                    onPress={() => naviagtion.navigate(item.screen)}
                    style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
                    disabled={!origin}
                    >
                        <View>
                            <Image
                            style={{ width: 120, height: 120, resizeMode: "contain" }}
                            source={{uri: item.image}}
                            />
                            <Text style={tw`mt-2 text-lg font-semibold`}>{item.title}</Text>
                            <Icon 
                            style={tw`p-2 bg-black rounded-full w-10 mt-4`}
                            type="antdesign" color="white" name='arrowright'/>
                        </View>
                    </TouchableOpacity>
                )
            } />
    )
}

export default NavOptions
