import { useContext } from "react";
import { FavoriteContext } from "./FavoriteContext";


export function useFavorite() {
    return useContext(FavoriteContext);
}