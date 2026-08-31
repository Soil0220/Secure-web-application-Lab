import {postApi, getApi, deleteApi} from '../../components/RequestApi.jsx';
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
            return error.response?.data;
        }
    }

    const createNotice = async (formData) => {
        try {
            setLoading(true);
            const response = await postApi('/notice/admin', formData, true);
            await getNotices();
            return response.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    }

    const deleteNotice = async (noticeId) => {
        try {

            const response = await deleteApi(`/notice/${noticeId}/admin`, {}, true);
            await getNotices()
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    return (
    <NoticeContext.Provider
        value={{ getNotices, createNotice, deleteNotice, notices, setNotices }}
    >
        {children}
    </NoticeContext.Provider>
    );
}