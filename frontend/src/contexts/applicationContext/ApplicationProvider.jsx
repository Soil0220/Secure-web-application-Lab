import {ApplicationContext} from "./ApplicationContext.jsx";
import {useState} from "react";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {getApi} from "../../components/RequestApi.jsx";

export function ApplicationProvider({ children }) {

    const [applications, setApplications] = useState([]);
    const {setLoading} = useLoading();

    const getAllApplications = async () => {
        try {
            const response = await getApi('/application/admin', {}, true);
            setApplications(response.data.data);
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
        <ApplicationContext.Provider
            value={{applications, setApplications, getAllApplications}}
        >
            {children}
        </ApplicationContext.Provider>
    );
}