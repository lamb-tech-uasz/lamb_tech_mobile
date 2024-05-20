import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import NavOptions from '../components/NavOptions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_KEY } from "@env"
import { useDispatch } from 'react-redux'
import { setDestination, setOrigin } from '../../slices/navSlice'
import Preference from '../components/Preference'
import Map from '../components/Map'
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native'
import Trajet from './Trajet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Icon } from '@rneui/base'

const Home = () => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [user, setUser] = useState(null);

    const dispatch = useDispatch()
    const naviagtion = useNavigation()
    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            let data = {
                "lat": latitude,
                "lng": longitude
            }
            const adresse = await Location.reverseGeocodeAsync({
                latitude: latitude,
                longitude: longitude
            })
            console.log(adresse[0].subregion)
            console.log(data)
            dispatch(
                setOrigin({
                    location: data,
                    description: adresse[0].subregion + ", " + adresse[0].region + ", " + adresse[0].country
                }))
            setLocation(location);
            console.log(location)
        })();
    }, []);
    useEffect(() => {
        const getData = async () => {
            try {
                const u = await AsyncStorage.getItem("utilisateur")
                if (u !== null) {
                    setUser(JSON.parse(u))
                }
            } catch (e) {
                console.error("Error reading value:", e);
            }
        };

        getData()
    }, []);
    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }
    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <View style={tw`p-5`}>
                <View>
                    <Text style={tw`font-semibold text-lg`}>Dallal akk diam</Text>
                    <Text style={tw`text-gray-500`}>{user?.prenom + " " + user?.nom}</Text>
                    <View style={tw`absolute top-16 right-8 z-50 flex-row`}>
                        <TouchableOpacity
                            onPress={() => naviagtion.navigate("Profile")}
                            style={tw`bg-gray-100 p-3 rounded-full shadow-lg mr-2`}
                        >
                            <Icon type='feather' name="user" />
                        </TouchableOpacity>
                        {user?.type === 'conducteur' && (

                            <TouchableOpacity
                                onPress={() => naviagtion.navigate("Mestrajet")}
                                style={tw`bg-gray-100 p-3 rounded-full shadow-lg`}
                            >
                                <Icon type='feather' name="map" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Image
                    style={{
                        width: 100,
                        height: 100,
                        resizeMode: "contain"
                    }}
                    source={require("../../assets/logo.png")} />



                {/* <NavOptions /> */}

                {user?.type === 'passager' && (
                    <><GooglePlacesAutocomplete
                        placeholder='Fann gay dém ?'
                        styles={{
                            container: {
                                flex: 0
                            },
                            textInput: {
                                fontSize: 18,
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 5,
                            }
                        }}
                        onFail={(error) => console.log(error)}
                        onPress={(data, details = null) => {
                            console.log(details.geometry.location)
                            dispatch(
                                setDestination({
                                    location: details.geometry.location,
                                    description: data.description
                                }))
                            naviagtion.navigate("Location")
                            // dispatch(setDestination(null))
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                        minLength={2}
                        query={{
                            key: "key",
                            language: 'en',
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        debounce={400} /><Preference /></>
                )
                }
                {user?.type === 'conducteur' && (
                    <Trajet />
                )
                }
            </View>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({

})