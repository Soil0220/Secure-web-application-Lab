import {useEffect, useState} from "react";
import {AuthContext} from "./AuthContext.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import { postApi, getApi } from '../../components/RequestApi.jsx';

export function AuthProvider({ children }) {

    const [session, setSession] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const {setLoading} = useLoading();

    //세션체크
    const checkSession = async () => {
        try {
            setLoading(true);
            const response = await getApi('/session/public', {}, false);
            setSession(response.data.data);
        } catch (error) {
            setSession(null);
            return error.response?.data;
        } finally {
            setLoading(false);
            setIsAuthLoading(false);
        }
    }

    //세션연장
    const extendSession = async () => {
        try {
            const response = await postApi('/session/extend', {}, true);
            setSession(response.data.data);
        } catch (error) {
            setSession(null);
            return error.response?.data;
        }
    }

    const login = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/user/login/public',formData ,false);
            setSession(response.data.data);
            return response?.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await postApi('/user/logout',{} ,true);
            setSession(null);
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async(formData) => {
        try {
            setLoading(true);
            const response =  await postApi('/user/join/public', formData, false)
            return response?.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verifySession = async () => {
            await checkSession();
        };

        verifySession();

    }, []);

    return (
        <AuthContext.Provider
            value={{ session, setSession, checkSession, login, logout, signUp, isAuthLoading, extendSession }}
        >
            {children}
        </AuthContext.Provider>
    );
}