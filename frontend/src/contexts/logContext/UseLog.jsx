import {useContext} from "react";
import {LogContext} from "./LogContext.jsx";


export function useLog(){
    return useContext(LogContext);
}