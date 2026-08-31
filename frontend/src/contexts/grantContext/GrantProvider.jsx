import {GrantContext} from "./GrantContext.jsx";
import {useState} from "react";
import {deleteApi, getApi, postApi} from "../../components/RequestApi.jsx";
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
            return error.response?.data;
        }
    }

    const createGrant = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/grant/admin', formData, true);
            await getGrants();
            return response.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    }

    const deleteGrant = async (grantId) => {
        try {
            const response = await deleteApi(`/grant/${grantId}/admin`, {}, true);
            await getGrants();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    return (
        <GrantContext.Provider
            value={{ grants, setGrants, getGrants, createGrant, deleteGrant, recruitingGrants}}
        >
            {children}
        </GrantContext.Provider>
    );
}