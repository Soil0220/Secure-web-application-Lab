import {useState} from "react";
import {InquiryContext} from "./InquiryContext.jsx";
import {getApi, patchApi, postApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function InquiryProvider({ children }) {

    const [inquiries, setInquiries] = useState([]);
    const {setLoading} = useLoading();

    //문의 등록
    const createInquiry = async (title, content) => {
        try {
            const response = await postApi('/inquiry', {"title" : title, "content": content}, true);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
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
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    //전체 문의 조회
    const getAllInquiries = async () => {
        try {
            const response = await getApi('/inquiry/admin', {}, true);
            setInquiries(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    //문의 답변
    const updateInquiry = async (inquiryId, answer) => {
        try {
            const response = await patchApi(`/inquiry/${inquiryId}/admin`, {"answer" : answer}, true);
            await getAllInquiries();
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
        <InquiryContext.Provider
            value={{createInquiry, inquiries, setInquiries, getAllInquiries, getInquiries, updateInquiry}}
        >
            {children}
        </InquiryContext.Provider>
    );
}