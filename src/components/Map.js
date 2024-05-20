import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import tw from 'twrnc';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { API_URL } from '../context/AuthContext';
import axios from 'axios';
import { Icon } from '@rneui/base';
const colors = ["green", "red", "orange", "purple", "gray"];
const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination)
    const dispatch = useDispatch()
    const mapRef = useRef(null)
    const [trajet, setTrajet] = useState(null);
    useEffect(() => {
        if (!origin || !destination) return;

        mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
            edgePadding: {
                right: 50,
                top: 50,
                bottom: 50,
                left: 50
            }
        })
    }, [origin, destination])
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_URL}/trajets/all`);
                setTrajet(response.data)
            } catch (e) {
                console.log(e)
                console.error("Error reading value:", e);
            }
        };

        getData();
    }, []);
    useEffect(() => {
        if (!origin || !destination) return;
        const getTravalTime = async () => {
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin.description}&destinations=${destination.description}&key=key`)
                .then(res => res.json())
                .then((data) => {
                    console.log(data)
                    dispatch(
                        setTravelTimeInformation(data.rows[0].elements[0])
                    )
                })
        }
        getTravalTime()
    }, [origin, destination, "AIzaSyAD9-w1qTOHLS_l7sS6BJKgNJJfwqHoV0o"])
    return (
        <MapView
            ref={mapRef}
            mapType="mutedStandard"
            style={tw`flex-1`}
            initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }} >
            {origin && destination && (
                <MapViewDirections
                    origin={{ latitude: origin.location.lat, longitude: origin.location.lng }}
                    destination={destination.description}
                    apikey={"key"}
                    strokeWidth={3}
                    strokeColor="blue"
                />
            )}
            {origin?.location && (
                <Marker coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                    title="Prise en charge"
                    description={origin.description}
                    identifier="origin"
                    pinColor='green'
                />
            )}
            {trajet?.map && (
                <Marker coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng,
                }}
                    title="Prise en charge"
                    description={origin.description}
                    identifier="origin"
                >
                    <Icon
                        style={{ width: 50, height: 50, resizeMode: "contain" }}
                        source={{ uri: "https://links.papareact.com/3pn" }}
                    />
                </Marker>
            )}
            {destination?.location && (
                <Marker coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng,
                }}
                    title="Destinantion"
                    description={destination.description}
                    identifier="destination"
                />
            )}
            {trajet?.map((item, index) => (
                <MapViewDirections
                    key={index}
                    origin={{
                        latitude: item.latDepart,
                        longitude: item.lonDepart,
                    }}
                    destination={{
                        latitude: item.latDestination,
                        longitude: item.lonDestination,
                    }}
                    apikey={"key"}
                    strokeWidth={1}
                    strokeColor={colors[index % colors.length]}
                />
            ))}

            {trajet?.map((item, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: item.latDepart,
                        longitude: item.lonDepart,
                    }}
                    title="Prise en charge"
                    description={item.voiture.immatriculation}
                    identifier="origin"
                >
                    <Image
                        style={{ width: 50, height: 50, resizeMode: "contain" }}
                        source={{ uri: "https://links.papareact.com/3pn" }}
                    />
                </Marker>
            ))}
        </MapView>
    )
}

export default Map

const styles = StyleSheet.create({})