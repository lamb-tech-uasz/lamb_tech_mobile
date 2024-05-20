import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/base'
import tw from 'twrnc';

const data = [
    {
        id: "123",
        icon: "home",
        location: "Maison",
        destination: "Chez moi"
    },
    {
        id: "124",
        icon: "briefcase",
        location: "Travail",
        destination: "A mon lieu de travail"
    }
]
const Preference = () => {
    return (
        <View>
            <Text style={tw`font-bold text-lg mt-4 p-2`}>Mes préferences</Text>
            <FlatList
                data={data}
                // horizontal
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => {
                    <View
                        style={[tw`bg-gray-200`, { height: 0.5 }]}
                    />
                }}
                renderItem={
                    ({ item }) => (
                        <TouchableOpacity style={tw`flex-row items-center p-5`}>
                            <Icon
                                style={tw`mr-4 rounded-full bg-gray-300 p-3`}
                                name={item.icon}
                                type='ionicon'
                                color='white'
                                size={18}
                            />
                            <View>
                                <Text style={tw`font-semibold text-lg`}>{item.location}</Text>
                                <Text style={tw`text-gray-500`}>{item.destination}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                } />
        </View>

    )
}

export default Preference

const styles = StyleSheet.create({})