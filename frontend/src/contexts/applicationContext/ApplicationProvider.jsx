import {ApplicationContext} from "./ApplicationContext.jsx";
import {useState} from "react";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {getApi, patchApi, postApi} from "../../components/RequestApi.jsx";

export function ApplicationProvider({ children }) {

    const [applications, setApplications] = useState([]);
    const {setLoading} = useLoading();

    //유저별 신청 조회
    const getApplications = async () => {
        try {
            const response = await getApi('/application', {}, true);
            setApplications(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    //전체 신청 조회(Admin)
    const getAllApplications = async () => {
        try {
            const response = await getApi('/application/admin', {}, true);
            setApplications(response.data.data);
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    //신청 상태 변경(Admin)
    const updateApplicationStatus = async (applicationId, status) => {
        try {
            const response = await patchApi(`/application/${applicationId}/admin`, {"status" : status}, true);
            await getAllApplications();
            return response.data;
        } catch (error) {
            //응답 데이터 존재시 접근
            const customError = error.response?.data;
            return customError;
        } finally {
            setLoading(false);
        }
    }

    //신청 등록
    const createApplication = async (grantId, documentIds) => {
        try {
            const response = await postApi('/application', {"grantId" : grantId, "documentIds" : documentIds}, true);
            await getApplications();
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
        <ApplicationContext.Provider
            value={{createApplication, applications, setApplications, getApplications, getAllApplications, updateApplicationStatus}}
        >
            {children}
        </ApplicationContext.Provider>
    );
}