import { useEffect, useState } from 'react';
import { useGrant } from "../contexts/grantContext/UseGrant.jsx";
import { useDocument } from "../contexts/documentContext/UseDocument.jsx";
import { useApplication } from "../contexts/applicationContext/UseApplication.jsx";

/*
    지원금제도 신청 폼
    1. 지원금제도 카테고리, 서류타입 상태 정의
    2. useGrant를 통해 지원금제도 조회 함수 등록
    3. useDocument를 통해 업로드한 서류 조회 함수 등록
    4. useApplication을 통해 지원금 신청 함수 등록
    5. selectedGrantId, selectedDocumentIds을 통한 지원금제도와 서류 선택
    6. ignore을 이용한 뒤 늦은 비동기 응답이 상태를 초기화하지 못하게 설정
*/

const DOCUMENT_TYPE_MAP = {
    RESIDENT_REGISTRATION_COPY: "주민등록초본",
    FAMILY_RELATION_CERTIFICATE: "가족관계증명서",
    INCOME_VERIFICATION_DOCUMENT: "소득 증빙 서류",
    TAX_PAYMENT_CERTIFICATE: "납세증명서",
    BANK_ACCOUNT_STATEMENT: "통장 사본",
};

const GRANT_CATEGORY_MAP = {
    YOUTH_EMPLOYMENT: "청년",
    BUSINESS_STARTUP: "창업",
    LIVING_WELFARE: "생활/복지",
    HOUSING_FINANCE: "주거",
    HEALTH_CARE: "건강/의료",
};

export default function ApplicationForm({ isOpen, onClose }) {
    const { getGrants, recruitingGrants } = useGrant();
    const { documents, getDocuments } = useDocument();
    const { createApplication } = useApplication();

    const [selectedGrantId, setSelectedGrantId] = useState('');
    const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
    const [isDocError, setIsDocError] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        let ignore = false;

        const fetchData = async () => {
            let docError = false;

            // 지원금 목록 조회
            setIsFetching(true);

            try {
                await getGrants();
                setSelectedGrantId(recruitingGrants[0]?.grantId);
            } catch (err) {
                console.error("지원금 목록 조회 실패:", err);
            }

            // 서류 목록 조회
            try {
                await getDocuments();
            } catch (err) {
                console.error("서류 목록 조회 실패:", err);
                docError = true;
            }

            // 비동기 처리 완료 후 상태 반영
            if (!ignore) {
                setSelectedDocumentIds([]);
                setIsDocError(docError);
            }

            setIsFetching(false);
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, [isOpen]);

    //모달 오픈 및 초기화 대기
    if (!isOpen || isFetching) return null;

    // 기존 서류 선택배열에 포함 되어있으면 해제하고 없으면 추가
    const handleDocumentToggle = (docId) => {
        if (selectedDocumentIds.includes(docId)) {
            setSelectedDocumentIds(selectedDocumentIds.filter((id) => id !== docId));
        } else {
            setSelectedDocumentIds([...selectedDocumentIds, docId]);
        }
    };

    const handleSubmit = async () => {

        if (!selectedGrantId) {
            alert("신청 가능한 지원금 제도를 선택해주세요.");
            return;
        }

        if (!selectedDocumentIds || !(selectedDocumentIds.length > 0)) {
            alert("신청에 필요한 서류를 선택해주세요.");
            return;
        }

        try {
            await createApplication(selectedGrantId, selectedDocumentIds);
            alert("지원금 신청이 완료되었습니다.");

            setSelectedDocumentIds([]);
            setSelectedGrantId(recruitingGrants[0]?.grantId);
            onClose();
        } catch (error) {
            console.error("지원금 신청 실패:", error);
            alert("지원금 신청 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                    <div style={styles.modalTitleGroup}>
                        <span style={styles.modalBadge}>APPLY</span>
                        <h3 style={styles.modalTitle}>지원금 사업 신청</h3>
                    </div>
                </div>

                {/* 지원금 제도 선택 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        신청할 지원금 제도 <span style={styles.requiredIcon}>*</span>
                    </label>
                    <select
                        style={styles.select}
                        value={selectedGrantId || (recruitingGrants[0]?.grantId) || ''}
                        onChange={(e) => setSelectedGrantId(e.target.value)}
                    >
                        {recruitingGrants.length > 0 ? (
                            recruitingGrants.map((grant) => (
                                <option key={grant.grantId} value={grant.grantId}>
                                    [{GRANT_CATEGORY_MAP[grant.category] || grant.category}] {grant.title}
                                </option>
                            ))
                        ) : (
                            <option value="">현재 모집 중인 지원금 제도가 없습니다.</option>
                        )}
                    </select>
                </div>

                {/* 첨부 서류 선택 */}
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        첨부할 서류 선택 <span style={styles.subLabel}>(등록해둔 서류 목록)</span>
                    </label>
                    <div style={styles.documentListContainer}>
                        {isDocError ? (
                            <div style={styles.emptyDocumentText}>
                                서류 목록을 불러오지 못했습니다. 로그인 상태와 서류함을 확인해주세요.
                            </div>
                        ) : documents.length > 0 ? (
                            documents.map((doc) => {
                                const docId = doc.documentId;
                                const isChecked = selectedDocumentIds.includes(docId);
                                const docTypeName = DOCUMENT_TYPE_MAP[doc.docType] || doc.docType;

                                return (
                                    <label key={docId} style={styles.documentItem}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleDocumentToggle(docId)}
                                            style={styles.checkbox}
                                        />
                                        <div style={styles.documentTextGroup}>
                                            <span style={styles.documentTitle}>{docTypeName}</span>
                                            {doc.originFileName && (
                                                <span style={styles.documentFileName}>({doc.originFileName})</span>
                                            )}
                                        </div>
                                    </label>
                                );
                            })
                        ) : (
                            <div style={styles.emptyDocumentText}>
                                등록된 서류가 없습니다. 먼저 마이페이지에서 서류를 등록해주세요.
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.modalBtns}>
                    <button style={styles.modalPrimaryBtn} onClick={handleSubmit}>
                        신청하기
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(2px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "#ffffff", padding: "28px", borderRadius: "8px", width: "480px", maxHeight: "85vh", overflowY: "auto", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", display: "flex", flexDirection: "column", gap: "20px" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" },
    modalTitleGroup: { display: "flex", alignItems: "center", gap: "8px" },
    modalBadge: { backgroundColor: "#0056b3", color: "#ffffff", fontSize: "11px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" },
    modalTitle: { fontSize: "16px", fontWeight: "bold", color: "#111111", margin: 0 },
    formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "13px", fontWeight: "bold", color: "#0056b3", display: "flex", alignItems: "center", gap: "4px" },
    subLabel: { fontSize: "12px", color: "#666666", fontWeight: "normal" },
    requiredIcon: { color: "#dc2626" },
    select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", outline: "none", boxSizing: "border-box", width: "100%", cursor: "pointer" },
    documentListContainer: { display: "flex", flexDirection: "column", gap: "8px", maxHeight: "180px", overflowY: "auto", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px 12px", backgroundColor: "#f8fafc" },
    documentItem: { display: "flex", alignItems: "center", gap: "10px", padding: "6px 4px", cursor: "pointer", borderRadius: "4px", transition: "background-color 0.15s ease" },
    checkbox: { width: "16px", height: "16px", cursor: "pointer", accentColor: "#0056b3" },
    documentTextGroup: { display: "flex", flexDirection: "row", alignItems: "center", gap: "6px" },
    documentTitle: { fontSize: "13px", fontWeight: "bold", color: "#111111" },
    documentFileName: { fontSize: "12px", color: "#64748b" },
    emptyDocumentText: { fontSize: "13px", color: "#64748b", textAlign: "center", padding: "16px 0" },
    modalBtns: { display: "flex", marginTop: "4px" },
    modalPrimaryBtn: { width: "100%", padding: "11px 0", backgroundColor: "#0056b3", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
};