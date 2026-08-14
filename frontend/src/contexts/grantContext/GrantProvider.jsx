import {GrantContext} from "./GrantContext.jsx";
import {useState} from "react";
import {getApi, postApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function GrantProvider({ children }) {

    const [grants, setGrants] = useState([]);
    const {setLoading} = useLoading();

    const getGrants = async () => {
        try {
            const response = await getApi('/grant/public', {}, false);
            setGrants(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    const createGrant = async (formData) => {
        try {
            const response = await postApi('/grant/admin', formData, true);
            getGrants();
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }


    return (
        <GrantContext.Provider
            value={{ grants, setGrants, getGrants, createGrant}}
        >
            {children}
        </GrantContext.Provider>
    );
}