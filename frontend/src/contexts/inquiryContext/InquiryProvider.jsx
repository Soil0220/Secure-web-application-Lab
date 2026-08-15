import {useState} from "react";
import {InquiryContext} from "./InquiryContext.jsx";
import {getApi, patchApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";

export function InquiryProvider({ children }) {

    const [inquiries, setInquiries] = useState([]);
    const {setLoading} = useLoading();

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
            value={{inquiries, setInquiries, getAllInquiries, getInquiries, updateInquiry}}
        >
            {children}
        </InquiryContext.Provider>
    );
}