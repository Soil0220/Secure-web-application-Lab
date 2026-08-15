import {DocumentContext} from "./DocumentContext.jsx";
import {getApi} from "../../components/RequestApi.jsx";
import {useLoading} from "../loadingContext/UseLoading.jsx";
import axios from "axios";


export function DocumentProvider({ children }) {

    const {setLoading} = useLoading();

    const getDocument = async (documentId, documentName) => {
        try {
            const response = await getApi(
                `/document/${documentId}/admin`, { }, true, { responseType: 'blob' });

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
            setLoading(false);
        }
    }

    return (
        <DocumentContext.Provider
            value={{getDocument}}
        >
            {children}
        </DocumentContext.Provider>
    );
}