import {useContext} from "react";
import {DocumentContext} from "./DocumentContext.jsx";


export function useDocument(){
    return useContext(DocumentContext);
}