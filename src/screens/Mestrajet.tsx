import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { API_URL } from '../context/AuthContext';
import tw from 'twrnc';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Mestrajet() {
  const [trajet, setTrajet] = useState(null)
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${API_URL}/trajets/user`);
        console.log(response.data)
        setTrajet(response.data.filter(m => m.departA !== null))
      } catch (e) {
        console.log(e)
        console.error("Error reading value:", e);
      }
    };

    getData();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={tw`font-bold text-lg mt-4 p-2`}>Mes Trajets</Text>
      <FlatList
        data={trajet}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={tw`bg-white rounded-lg shadow-md p-4 mb-4`}>
            <View style={tw`flex-row justify-between mb-2`}>
              <Text style={tw`font-bold`}>{item.departA}</Text>
              <Text style={tw`font-bold`}>{item.destinationA}</Text>
            </View>
            <Text style={tw`text-gray-500 mb-2`}>{item.prix + " F cfa"}</Text>
            <Text style={tw`text-gray-500 mb-2`}>
              Plces {item.voiture.nombrePlace - item.placeOccupe}
            </Text>
            <TouchableOpacity style={tw`bg-red-500 py-2 px-4 rounded-full self-end`}>
              <Text style={tw`text-white font-bold`}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingBottom: 140,
    padding: 24,
    marginTop:30
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Empty */
  empty: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#8c9197',
    textAlign: 'center',
  },
  /** Fake */
  fake: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  fakeCircle: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: '#e8e9ed',
    marginRight: 16,
  },
  fakeLine: {
    width: 200,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#e8e9ed',
    marginBottom: 8,
  },
});