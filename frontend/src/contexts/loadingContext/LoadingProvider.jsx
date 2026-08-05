import {useState} from "react";
import {LoadingContext} from "./LoadingContext.jsx";

export function LoadingProvider({ children }) {

    const [loading, setLoading] = useState(true);


    return (
        <LoadingContext.Provider
            value={{
                loading,
                setLoading
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
}