import {useContext} from "react";
import {ApplicationContext} from "./ApplicationContext.jsx";


export function useApplication(){
    return useContext(ApplicationContext);
}