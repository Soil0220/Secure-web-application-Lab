import { postApi, getApi } from '../../components/RequestApi.jsx';
import {useLoading} from "../loadingContext/useLoading.jsx";
import {NoticeContext} from "./NoticeContext.jsx";
import {useState} from "react";

export function NoticeProvider({ children }) {

    const [notices, setNotices] = useState([]);
    const {setLoading} = useLoading();

    const getNotices = async () => {
        try {

            const response = await getApi('/notice/public', {}, false);
            setNotices(response.data.data)
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        }
    }

    const createNotice = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/notice/admin', formData, true);
            getNotices();
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
    <NoticeContext.Provider
        value={{ getNotices, createNotice, notices, setNotices }}
    >
        {children}
    </NoticeContext.Provider>
    );
}