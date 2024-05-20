import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import Home from './src/screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Location from './src/screens/Location';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Login from './src/screens/Login';
import Connexion from './src/screens/Connexion';
import Profile from './src/screens/Profile';
import Mestrajet from './src/screens/Mestrajet';
import Inscription from './src/screens/Inscription';

// export default function App() {
//   const { authState } = useAuth()
//   const Stack = createStackNavigator()
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         {/* {authState?.authenticated ? (
//         <SafeAreaProvider>
//         <KeyboardAvoidingView
//           behavior={
//             Platform.OS === "ios" ? "padding" : "height"
//           }
//           style={{ flex: 1 }}>
//           <Stack.Navigator>
//             <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
//             <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
//           </Stack.Navigator>
//         </KeyboardAvoidingView>

//       </SafeAreaProvider>) : (<Login />)} */}
//         <SafeAreaProvider>
//           <KeyboardAvoidingView
//             behavior={
//               Platform.OS === "ios" ? "padding" : "height"
//             }
//             style={{ flex: 1 }}>
//             {authState?.authenticated ? (<Stack.Navigator>
//               <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
//               <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
//             </Stack.Navigator>) : (<Login />)}

//           </KeyboardAvoidingView>

//         </SafeAreaProvider>

//       </NavigationContainer>

//     </Provider>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



export default function App() {

  return (
    <AuthProvider>
      <Layout></Layout>
    </AuthProvider>
  );
}


export const Layout = () => {
  const { authState } = useAuth()
  const Stack = createStackNavigator()
  console.log(authState?.authenticated)
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* {authState?.authenticated ? (
      <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
        style={{ flex: 1 }}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
        </Stack.Navigator>
      </KeyboardAvoidingView>

    </SafeAreaProvider>) : (<Login />)} */}
        <SafeAreaProvider>
          <KeyboardAvoidingView
            behavior={
              Platform.OS === "ios" ? "padding" : "height"
            }
            style={{ flex: 1 }}>
            {authState?.authenticated ? (<Stack.Navigator>
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
              <Stack.Screen name="Location" component={Location} options={{ headerShown: false }} />
              <Stack.Screen name="Mestrajet" component={Mestrajet} options={{ headerShown: false }} />
            </Stack.Navigator>) : (<Connexion />)}

          </KeyboardAvoidingView>

        </SafeAreaProvider>

      </NavigationContainer>

    </Provider>
  );
}