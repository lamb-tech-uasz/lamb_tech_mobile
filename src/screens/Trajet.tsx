import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { selectOrigin } from '../../slices/navSlice';

const Trajet = () => {
    const [loading, setLoading] = useState(false);
    const [voiture, setVoiture] = useState(null)
    const origin = useSelector(selectOrigin);
    console.log(origin)
    const [form, setForm] = useState({
        origine: '',
        destination: '',
        date: new Date(),
        showDatePicker: false,
        voiture: '',
        prix: '0'
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_URL}/voitures/conducteur`);
                setVoiture(response.data)
                console.log(voiture)
            } catch (e) {
                console.log(e)
                console.error("Error reading value:", e);
            }
        };

        getData()
    }, []);

    const handleChange = (key, value) => {
        if (key === 'voiture') {
            setForm({
                ...form,
                [key]: value.value,
            });
        } else {
            setForm({
                ...form,
                [key]: value,
            });
        }
    }
    const ajouterTrajet = async () => {
        const destination = form?.destination
        const origine = origin
        console.log(destination["name"])
        if (!form.date || !form.destination) {
            Alert.alert("Veuillez remplir la destination et la date.")
            return;
        }

        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment ajouter ce trajet de  " + origine["description"] + " à " + destination["name"] + " ?",
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
                            let data = {
                                latDepart: origine["location"].lat,
                                lonDepart: origine["location"].lng,
                                latDestination: destination["location"].lat,
                                lonDestination: destination["location"].lng,
                                dateDepart: form.date,
                                voiture: voiture,
                                prix: form.prix,
                                departA: origine["name"],
                                destinationA: destination["name"]

                            }
                            const response = await axios.post(`${API_URL}/trajets/create`, data);
                            const a = response.data
                            console.log(a)
                            if (!a.error) {
                                setForm({
                                    origine: '',
                                    destination: '',
                                    date: new Date(),
                                    showDatePicker: false,
                                    voiture: '',
                                    prix: '0'
                                })
                                Alert.alert("Succès", a.message);

                                // await getAllSocieteTierce()
                            } else {
                                Alert.alert("Erreur", a.message);
                            }
                        } catch (error) {
                            Alert.alert("Erreur", "Erreur lors de l'ajout de la société.");
                        } finally {
                            setLoading(false)
                        }
                    }
                }
            ],
            { cancelable: false }
        );

    };
    return (
        <View>
            <Text style={tw`font-bold text-lg mt-4 p-2`}>Création de mon trajet</Text>
            <GooglePlacesAutocomplete
                placeholder='Votre destination ?'
                styles={{
                    container: { flex: 0 },
                    textInput: {
                        fontSize: 18,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderRadius: 5,
                    },
                }}
                onFail={(error) => console.log(error)}
                onPress={(data, details = null) => {
                    handleChange("destination", {
                        name: data.description,
                        location: {
                            lat: details.geometry.location.lat,
                            lng: details.geometry.location.lng,
                        },
                    });
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                minLength={2}
                query={{
                    key: 'AIzaSyAD9-w1qTOHLS_l7sS6BJKgNJJfwqHoV0o',
                    language: 'en',
                }}
                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={400}
            />
            <View>
                <Text
                    style={styles.inputLabel}>
                    Date et heure
                </Text>
                <DateTimePicker
                    minimumDate={new Date()}
                    minuteInterval={5}
                    value={form.date}
                    mode="datetime"
                    locale="fr"
                    display="default"
                />
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                        <Text style={styles.inputLabel}>Prix du trajet</Text>
                        <TextInput
                            style={styles.inputControl}
                            placeholder="Prix du trajet"
                            value={form.prix}
                            onChangeText={(text) => handleChange('prix', text)}
                        />
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={ajouterTrajet}>
                        <View style={styles.btn}>
                            {loading ? (
                                <Text style={styles.btnText}><ActivityIndicator size={17} color="white" style={{ marginRight: 8 }} /> Nouveau trajet</Text>
                            ) : (
                                <Text style={styles.btnText}>Nouveau trajet</Text>
                            )}


                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Trajet

const styles = StyleSheet.create({
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: 'black',
        marginBottom: 8,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    btn: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
})