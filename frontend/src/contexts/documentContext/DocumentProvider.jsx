import {DocumentContext} from "./DocumentContext.jsx";
import {deleteApi, getApi, postApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import {useState} from "react";


export function DocumentProvider({ children }) {

    const {setLoading} = useLoading();
    const [documents, setDocuments] = useState([]);

    //신청서에 담긴 파일 다운로드
    const downloadApplicationDocument = async (documentId, documentName) => {
        try {
            setLoading(true);
            const response = await getApi(
                `/document/application/${documentId}`, { }, true, { responseType: 'blob' });

            // 전달받은 blob으로 다운로드 처리
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = documentName; // 원하는 파일명
            document.body.appendChild(link);
            link.click();

            // 메모리 해제 및 cleanup
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        } finally {
            setLoading(false);
        }
    }

    //유저별 개인 서류함 조회
    const getDocuments = async () => {
        try {
            const response = await getApi('/document', {}, true);
            setDocuments(response.data.data);
            return response.data;
        } catch (error) {
            setDocuments([]);
            return error.response?.data;
        }
    }

    //유저별 개인 서류함 파일 다운로드
    const downloadDocument = async (documentId, documentName) => {
        try {
            setLoading(true);
            const response = await getApi(
                `/document/${documentId}`, { }, true, { responseType: 'blob' });

            // 전달받은 blob으로 다운로드 처리
            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = documentName; // 원하는 파일명
            document.body.appendChild(link);
            link.click();

            // 메모리 해제 및 cleanup
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        } finally {
            setLoading(false);
        }
    }

    //유저별 개인 서류함 파일 업로드
    const uploadDocument = async (file, docType) => {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('docType', docType);

        try {
            setLoading(true);
            const response = await postApi('/document/upload', formData, {});
            return response.data;
        } catch (error) {
            console.error('파일 업로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    //서류함에 있는 서류 삭제
    const deleteDocument = async (documentId) => {
        try {
            const response = await deleteApi(`/document/${documentId}`, {}, true);
            await getDocuments();
            return response.data;
        } catch (error) {
            return error.response?.data;
        }
    }


    return (
        <DocumentContext.Provider
            value={{downloadApplicationDocument, downloadDocument, uploadDocument, deleteDocument, documents, getDocuments, setDocuments}}
        >
            {children}
        </DocumentContext.Provider>
    );
}