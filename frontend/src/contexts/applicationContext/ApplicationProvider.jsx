import {ApplicationContext} from "./ApplicationContext.jsx";
import {useState} from "react";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {deleteApi, getApi, patchApi, postApi} from "../../components/RequestApi.jsx";

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
            return error.response?.data;
        }
    }

    //전체 신청 조회(Admin)
    const getAllApplications = async () => {
        try {
            const response = await getApi('/application/admin', {}, true);
            setApplications(response.data.data);
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    //신청 상태 변경(Admin)
    const updateApplicationStatus = async (applicationId, status) => {
        try {
            const response = await patchApi(`/application/${applicationId}/admin`, {"status" : status}, true);
            await getAllApplications();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }

    //신청 등록
    const createApplication = async (grantId, documentIds) => {
        try {
            setLoading(true);
            const response = await postApi('/application', {"grantId" : grantId, "documentIds" : documentIds}, true);
            await getApplications();
            return response.data;
        } catch (error) {
            return error.response?.data;
        } finally {
            setLoading(false);
        }
    }

    //신청 삭제
    const deleteApplication = async (applicationId) => {
        try {
            const response = await deleteApi(`/application/${applicationId}`, {}, true);
            await getApplications();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }


    return (
        <ApplicationContext.Provider
            value={{createApplication, applications, setApplications, getApplications, deleteApplication, getAllApplications, updateApplicationStatus}}
        >
            {children}
        </ApplicationContext.Provider>
    );
}