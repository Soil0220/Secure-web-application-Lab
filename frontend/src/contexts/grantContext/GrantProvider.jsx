import {GrantContext} from "./GrantContext.jsx";
import {useState} from "react";
import {getApi, postApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function GrantProvider({ children }) {

    const [grants, setGrants] = useState([]);
    const [recruitingGrants, setRecruitingGrants] = useState([]);
    const {setLoading} = useLoading();

    const getGrants = async () => {
        try {
            const response = await getApi('/grant/public', {}, false);
            setGrants(response.data.data);
            setRecruitingGrants( (grants || []).filter(grant => grant.status === 'RECRUITING'));
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    const createGrant = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/grant/admin', formData, true);
            await getGrants();
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
            value={{ grants, setGrants, getGrants, createGrant, recruitingGrants}}
        >
            {children}
        </GrantContext.Provider>
    );
}