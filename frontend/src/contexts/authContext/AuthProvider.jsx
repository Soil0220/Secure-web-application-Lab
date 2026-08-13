import {useState} from "react";
import {AuthContext} from "./AuthContext.jsx";
import {useLoading} from "../loadingContext/useLoading.jsx";
import { postApi, getApi } from '../../components/RequestApi.jsx';

export function AuthProvider({ children }) {

    const [session, setSession] = useState(null);
    const {setLoading} = useLoading();

    const checkSession = async () => {
        try {
            setLoading(true);
            const response = await getApi('/user/session/public', {}, false);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    const login = async (formData) => {
        const response = await postApi('/user/login/public',formData ,false);
        setSession(response.data.data);
    };

    const logout = async () => {
        await postApi('/user/logout',{} ,true);
        setSession(null);
    };

    const signUp = async(formData) => {
        await postApi('/user/join/public', formData, false)
    };

    return (
        <AuthContext.Provider
            value={{ session, setSession, checkSession, login, logout, signUp }}
        >
            {children}
        </AuthContext.Provider>
    );
}