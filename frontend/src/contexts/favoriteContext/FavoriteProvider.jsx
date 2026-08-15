
import {FavoriteContext} from "./FavoriteContext.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {getApi} from "../../components/RequestApi.jsx";
import {useState} from "react";

export function FavoriteProvider({ children }) {

    const {setLoading} = useLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    return (
        <FavoriteContext.Provider
            value={{favorites, setFavorites, getFavorites}}
        >
            {children}
        </FavoriteContext.Provider>
    );
}