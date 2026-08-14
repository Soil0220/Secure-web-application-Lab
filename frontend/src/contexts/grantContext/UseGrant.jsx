import {useContext} from "react";
import {GrantContext} from "./GrantContext.jsx";


export function useGrant(){
    return useContext(GrantContext);
}