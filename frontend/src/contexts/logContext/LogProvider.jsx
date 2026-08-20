import {useState} from "react";
import {LogContext} from "./LogContext.jsx";
import {getApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function LogProvider({ children }) {

    const [logs, setLogs] = useState([]);

    const getLogs = async () => {
        try {
            const response = await getApi('/monitoring/admin', {}, true);
            setLogs(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    return (
        <LogContext.Provider
            value={{logs, setLogs, getLogs}}
        >
            {children}
        </LogContext.Provider>
    );
}