import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null }
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "807605274673228623802113__plateforme-access-token"
export const API_URL_AUTH = 'http://192.168.168.188:8080/covoiturage/auth'
export const API_URL = 'http://192.168.168.188:8080/covoiturage'
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true
                })
            }
        }
        loadToken()
    }, [])

    const register = async (email: string, password: string) => {
        try {
            return await axios.post(`${API_URL_AUTH}/users`, { email, password })
        } catch (e) {
            return { error: true, msg: (e as any).response.data?.msg }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            console.log(email)
            const result = await axios.post(`${API_URL_AUTH}/signin`, { telephone: email, password: password })
            const data = result.data;

console.log(data)
            const utilisateur = {
                email: data.email,
                id: data.id,
                telephone: data.telephone,
                prenom:data.prenom,
                nom:data.nom,
                type:data.type,
                cni:data.cni,
            };

            await AsyncStorage.setItem('utilisateur', JSON.stringify(utilisateur));

            setAuthState({
                token: data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, data.token);

            return result;
        } catch (e) {
            return { error: true, msg: (e as any).response?.detail }
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await AsyncStorage.clear();
        axios.defaults.headers.common['Authorization'] = ''

        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
