import { useEffect, useState } from "react";
import { useDocument } from "../../contexts/documentContext/UseDocument.jsx";
import {DOC_TYPE_MAP} from "../../constants/status.jsx";

/*
    유저 대시보드
    1. 파일 타입별 MAP 정의
    2. useDocument를 통한 서류함 파일 조회 및 파일 업로드 함수 등록
    3. selectedDocType을 통한 업로드 할 파일의 타입 지정
    4. isDragging, handleDragOver, handleDragLeave, handleDrop을 통한 드래그 기반 파일 업로드 기능
*/

export default function DocumentManagement() {
    const { documents, getDocuments, deleteDocument, uploadDocument, downloadDocument } = useDocument();
    const [selectedDocType, setSelectedDocType] = useState('RESIDENT_REGISTRATION_COPY');

    const handleDocumentClick = async (documentId, documentName) => {
        await downloadDocument(documentId, documentName);
    }

    const handleUpload = async (files) => {
        if (!files || files.length === 0) return;
        const fileToUpload = files[0];
        try {
            await uploadDocument(fileToUpload, selectedDocType);
            alert('서류가 성공적으로 업로드되었습니다.');
            await getDocuments();
        } catch {
            alert('서류 업로드에 실패했습니다.');
        }
    };

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleUpload(files);
        }
    };

    useEffect( () => {
        const fetchData = async () => {
            await getDocuments();
        };
        fetchData();

    }, []);

    return (

        <div style={styles.container}>
            {/* 상단 헤더 영역*/}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.contentTitle}>자주 쓰는 서류</h2>
                    <span style={styles.totalBadge}>
                        총 <strong style={{ color: "#0056b3" }}>{documents?.length || 0}</strong>건
                    </span>
                </div>
            </div>

            {/* 서류 종류 선택 드롭다운 영역 */}
            <div style={styles.selectWrapper}>
                <label style={styles.selectLabel}>업로드할 서류 종류</label>
                <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value)}
                    style={styles.customSelect}
                >
                    <option value="RESIDENT_REGISTRATION_COPY">주민등록초본</option>
                    <option value="FAMILY_RELATION_CERTIFICATE">가족관계증명서</option>
                    <option value="INCOME_VERIFICATION_DOCUMENT">소득 증빙 서류</option>
                    <option value="TAX_PAYMENT_CERTIFICATE">납세증명서</option>
                    <option value="BANK_ACCOUNT_STATEMENT">통장 사본</option>
                </select>
            </div>

            {/* 서류 목록 */}
            <div style={styles.cardContainer}>
                {documents && documents.length > 0 ? (
                    documents.map((doc) => (
                        <div key={doc.documentId} style={styles.dataCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={styles.cardCategory}>
                                    {DOC_TYPE_MAP[doc.docType] || doc.docType}
                                </span>
                                <button
                                    type="button"
                                    onClick={async () => await deleteDocument(doc.documentId)}
                                    style={styles.deleteBtn}
                                    aria-label="삭제"
                                    title="삭제"
                                >
                                    ✕
                                </button>
                            </div>
                            <h4
                                style={{ ...styles.cardTitle, cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDocumentClick(doc.documentId, doc.originFileName);
                                }}
                            >
                                {doc.originFileName}
                            </h4>
                            <p style={styles.cardDetail}>등록된 제출 서류</p>
                        </div>
                    ))
                ) : (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>등록된 서류가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 드래그 앤 드롭 영역 */}
            <div
                style={{
                    ...styles.dropZone,
                    ...(isDragging ? styles.dropZoneActive : {}),
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <p style={styles.dropText}>
                    {isDragging
                        ? "손을 놓으면 파일 업로드가 시작됩니다."
                        : "+ 여기에 파일을 드래그앤드롭하여 서류를 업로드하세요."}
                </p>
            </div>
        </div>
    );
}


const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#ffffff', width: '100%', boxSizing: 'border-box' },
    headerRow: { marginBottom: '20px', borderBottom: '2px solid #111111', paddingBottom: '10px' },
    titleGroup: { display: 'flex', alignItems: 'baseline', gap: '12px' },
    contentTitle: { fontSize: '20px', fontWeight: 'bold', color: '#111111', margin: 0, letterSpacing: '-0.02em' },
    totalBadge: { fontSize: '14px', color: '#666666' },
    selectWrapper: { marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' },
    selectLabel: { fontSize: '13px', fontWeight: 'bold', color: '#666666' },
    customSelect: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#111111', fontSize: '14px', fontWeight: '500', cursor: 'pointer', maxWidth: '320px' },
    cardContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    dataCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' },
    cardCategory: { fontSize: '12px', fontWeight: 'bold', color: '#0056b3' },
    cardTitle: { display: 'inline-block', alignSelf: 'flex-start', width: 'fit-content',fontSize: '15px', fontWeight: 'bold', color: '#111111', margin: '2px 0 0 0' },
    cardDetail: { fontSize: '12px', color: '#888888', margin: '2px 0 0 0' },
    emptyCard: { backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '32px', textAlign: 'center' },
    emptyText: { fontSize: '14px', color: '#666666', margin: 0 },
    dropZone: { marginTop: '24px', border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '32px 20px', textAlign: 'center', backgroundColor: '#f8f9fa', transition: 'all 0.2s ease', cursor: 'pointer' },
    dropZoneActive: { borderColor: '#0056b3', backgroundColor: '#eff6ff' },
    dropText: { margin: 0, fontSize: '14px', color: '#666666', fontWeight: 'bold' },
    deleteBtn: {background: 'none', border: 'none', color: '#8c95a1', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, transition: 'all 0.15s ease', marginLeft: 'auto'},
};