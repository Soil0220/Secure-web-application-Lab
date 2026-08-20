
import {FavoriteContext} from "./FavoriteContext.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {deleteApi, getApi, postApi} from "../../components/RequestApi.jsx";
import {useState} from "react";

export function FavoriteProvider({ children }) {

    const [favorites, setFavorites] = useState([]);

    const getFavorites = async () => {
        try {
            const response = await getApi('/favorite', {}, true);
            setFavorites(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    const createFavorite = async (grantId) => {
        try {
            const response = await postApi(`/favorite/${grantId}`, {}, true);
            await getFavorites();
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    const deleteFavorite = async (grantId) => {
        try {
            const response = await deleteApi(`/favorite/${grantId}`, {}, true);
            await getFavorites();
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    return (
        <FavoriteContext.Provider
            value={{favorites, setFavorites, getFavorites, createFavorite, deleteFavorite}}
        >
            {children}
        </FavoriteContext.Provider>
    );
}