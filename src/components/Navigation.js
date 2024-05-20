import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_KEY } from '@env';
import { useDispatch, useSelector } from 'react-redux';
import { selectTravelTimeInformation, setDestination } from '../../slices/navSlice';
import { useNavigation } from '@react-navigation/native';
import Preference from './Preference';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '@rneui/base';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';

const Navigation = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation()
    const [trajet, setTrajet] = useState(null);
    const traval = useSelector(selectTravelTimeInformation)
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_URL}/trajets/all`);
                setTrajet(response.data.filter(m => m.departA !== null))
                console.log(trajet)
            } catch (e) {
                console.log(e)
                console.error("Error reading value:", e);
            }
        };

        getData();
    }, []);

    const handleReservation = (item) => {
        console.log(item)
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment reserver pour ce trajet de  " + item.departA + " à " + item.destinationA + " ?",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                    onPress: () => setLoading(false)
                },
                {

                    text: "OK",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const response = await axios.post(`${API_URL}/reservations/create/${item.id}`);
                            const a = response.data
                            console.log(a)
                            if (!a.error) {
                                Alert.alert("Succès", a.message);

                                await getData()
                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            console.log("error d'ajout")
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    }
    return (
        <SafeAreaView style={tw`bg-white flex-1`}>
            <Text style={tw`text-center text-xl`}>Votre trajet est de {traval?.distance.text.split(" ")[0]} km </Text>
            <View style={tw`border-gray-200`}>
                <View>
                    <FlatList
                        data={trajet}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Preference', { item })}
                                style={tw`flex-row items-center p-3`}
                            >
                                <Text style={tw`flex-1 ml-3`}>{item.departA}</Text>
                                <Text style={tw`flex-1 ml-3`}>{item.destinationA}</Text>
                                <Text style={tw`text-gray-500`}>{item.prix + " F cfa"} </Text>
                                <Text style={tw`text-gray-500`}>Plces {item.voiture.nombrePlace - item.placeOccupe} </Text>


                                <TouchableOpacity
                                    style={tw`bg-black p-3 rounded-full`}
                                    onPress={() => handleReservation(item)}
                                >
                                    <Text style={tw`text-white font-bold`}>Réserver</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Navigation

const toInputBoxStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 0,
        fontSize: 18
    },
    textInput: {
        backgroundColor: '#DDDDDF',
        borderRadius: 0,
        fontSize: 18
    },
    textInputContainer: {
        paddingHorizontal: 20,
        paddingBottom: 0
    }
})