import {useState} from "react";
import {LogContext} from "./LogContext.jsx";
import {getApi} from "../../components/RequestApi.jsx";

export function LogProvider({ children }) {

    const [logs, setLogs] = useState([]);


    const getLogs = async (search) => {
        try {

            const response = await getApi('/monitoring/admin', {apiUrl: search }, true);
            setLogs(response.data.data);
            return response.data;
        } catch (error) {

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