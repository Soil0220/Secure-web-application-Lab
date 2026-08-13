import { postApi, getApi } from '../../components/RequestApi.jsx';
import {useLoading} from "../loadingContext/useLoading.jsx";
import {NoticeContext} from "./NoticeContext.jsx";

export function NoticeProvider({ children }) {

    const {setLoading} = useLoading();

    const getNotices = async () => {
        try {

            const response = await getApi('/notice/public', {}, false);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    const createNotice = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/notice/admin', formData, true);
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
        value={{ getNotices, createNotice }}
    >
        {children}
    </NoticeContext.Provider>
    );
}