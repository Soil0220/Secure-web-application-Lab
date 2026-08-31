import {useState} from "react";
import {InquiryContext} from "./InquiryContext.jsx";
import {deleteApi, getApi, patchApi, postApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function InquiryProvider({ children }) {

    const [inquiries, setInquiries] = useState([]);
    const {setLoading} = useLoading();

    //문의 등록
    const createInquiry = async (title, content, link) => {
        try {
            setLoading(true);
            const response = await postApi('/inquiry', {"title" : title, "content": content, "link": link}, true);
            return response.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    }

    //유저별 문의 조회
    const getInquiries = async () => {
        try {
            const response = await getApi('/inquiry', {}, true);
            setInquiries(response.data.data);
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    //전체 문의 조회
    const getAllInquiries = async () => {
        try {
            const response = await getApi('/inquiry/admin', {}, true);
            setInquiries(response.data.data);
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    //문의 답변
    const updateInquiry = async (inquiryId, answer) => {
        try {
            const response = await patchApi(`/inquiry/${inquiryId}/admin`, {"answer" : answer}, true);
            await getAllInquiries();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    //문의 삭제
    const deleteInquiry = async (inquiryId) => {
        try {
            const response = await deleteApi(`/inquiry/${inquiryId}`, {}, true);
            setInquiries(response.data.data);
            await getInquiries();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    return (
        <InquiryContext.Provider
            value={{createInquiry, inquiries, setInquiries, deleteInquiry, getAllInquiries, getInquiries, updateInquiry}}
        >
            {children}
        </InquiryContext.Provider>
    );
}