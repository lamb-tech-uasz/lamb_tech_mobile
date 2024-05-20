import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import Map from '../components/Map';
import { createStackNavigator } from '@react-navigation/stack';
import Navigation from '../components/Navigation';
import RideOptions from '../components/RideOptions';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/base';

const Location = () => {
  const Stack = createStackNavigator()
  const navigation = useNavigation()
  return (
    <View >
     <TouchableOpacity onPress={() => navigation.navigate("Home")} style={tw`bg-gray-100 absolute top-16 left-8 z-50 p-3 rounded-full shadow-lg`}>
  <Icon type='feather' name="arrow-left" />
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate("Profile")} style={tw`bg-gray-100 absolute top-16 right-8 z-50 p-3 rounded-full shadow-lg`}>
  <Icon type='feather' name="user" />
</TouchableOpacity>
      <View style={tw`h-2/3`}>
        <Map />
      </View>
      <View style={tw`h-1/3`}>
        <Stack.Navigator>
          <Stack.Screen name='Navigation' component={Navigation} options={{ headerShown: false }} />
          <Stack.Screen name='RideOptions' component={RideOptions} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </View>
  )
}

export default Location

const styles = StyleSheet.create({})