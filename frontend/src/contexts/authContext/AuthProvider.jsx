import {useState} from "react";
import {AuthContext} from "./AuthContext.jsx";
import {useLoading} from "../loadingContext/useLoading.jsx";
import axios from "axios";

export function AuthProvider({ children }) {

    const [session, setSession] = useState(null);
    const {setLoading} = useLoading();

    const checkSession = async () => {
        try{
            setLoading(true);
            const response = await axios.get('http://localhost:8080/user/session',{withCredentials: true});
            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    message: null
                };
            }
        } catch (error) {

            return {
                success: false,
                data: error.response.data,
                message: error
            };
        } finally {
            setLoading(false);
        }
    }

    const login = async (formData) => {
        try{
            const response = await axios.post('http://localhost:8080/user/login', formData,{withCredentials: true});
            if (response.status === 200) {
                setSession(response.data);
                return {
                    success: true,
                    data: response.data,
                    message: null
                };
            }
        } catch (error) {
            setSession(null);
            return {
                success: false,
                data: error.response.data,
                message: error
            };
        }
    };

    const logout = async () => {
        await axios.post('http://localhost:8080/user/logout', {},{withCredentials: true});
        setSession(null);
    };

    return (
        <AuthContext.Provider
            value={{ session, setSession, checkSession, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}