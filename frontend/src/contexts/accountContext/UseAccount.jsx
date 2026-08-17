import {useContext} from "react";
import {AccountContext} from "./AccountContext.jsx";


export function useAccount(){
    return useContext(AccountContext);
}