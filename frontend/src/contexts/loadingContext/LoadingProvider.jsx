import {useState} from "react";
import {LoadingContext} from "./LoadingContext.jsx";

export function LoadingProvider({ children }) {

    const [loading, setLoading] = useState(true);


    return (
        <LoadingContext.Provider
            value={{loading, setLoading}}
        >
            {children}

            {loading && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 9999, color: 'white'
                }}>
                    <div>⚙️ 처리 중입니다. 잠시만 기다려주세요...</div>
                </div>
            )}
        </LoadingContext.Provider>
    );
}