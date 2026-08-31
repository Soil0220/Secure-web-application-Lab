import { useEffect, useState } from 'react';
import { useGrant } from "../../contexts/grantContext/UseGrant.jsx";
import {GRANT_CATEGORY_MAP, GRANT_CYCLE_MAP, GRANT_STATUS_MAP} from "../../constants/status.jsx";


/*
    지원금 제도 관리
    1. CATEGORY, CYCLE, STATUS MAP과 날짜 포맷팅 함수 정의
    2. useGrant를 이용한 지원금제도 조회, 지원금 제도 생성 함수 등록
    4. showModal을 통한 지원금제도 생성 창 ON/OFF
    5. 모달 내에서 등록하기 버튼 클릭시 newProg데이터로 지원금 제도 생성 함수 실행(요청 보낼시에는 날짜를 ISO8601로 변환)
*/


const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
};

export default function GrantManagement() {
    const { grants, createGrant, deleteGrant, getGrants } = useGrant();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // 신규 등록 폼 상태 (Enum 기본값 설정)
    const [newProg, setNewProg] = useState({
        title: '',
        category: 'YOUTH_EMPLOYMENT',
        cycle: 'MONTHLY',
        content: '',
        amount: '',
        startDate: '',
        endDate: '',
        status: 'PREPARING'
    });

// 지원금 제도 생성
    const handleCreate = async () => {
        // 요청 보낼 데이터의 날짜는 ISO8601로 변환
        const formattedData = {
            ...newProg,
            startDate: newProg.startDate ? `${newProg.startDate}T00:00:00Z` : null,
            endDate: newProg.endDate ? `${newProg.endDate}T00:00:00Z` : null,
        };

        try {
            setLoading(true);
            await createGrant(formattedData);
            setShowModal(false);
            setNewProg({
                title: '',
                category: 'YOUTH_EMPLOYMENT',
                cycle: 'MONTHLY',
                content: '',
                amount: '',
                startDate: '',
                endDate: '',
                status: 'PREPARING'
            });
        } catch (error) {
            console.error("지원금 제도 등록 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const run = async () => {
            await getGrants();
        };
        run();
    }, []);

    return (
        <div style={styles.container}>
            {/* Header 영역 */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.contentTitle}>지원 사업 관리</h2>
                    <span style={styles.totalBadge}>
                        총 <strong style={{ color: "#0056b3" }}>{grants?.length || 0}</strong>건
                    </span>
                </div>
                <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>
                    + 신규 지원사업 등록
                </button>
            </div>

            {/* 사업 카드 목록 */}
            <div style={styles.cardList}>
                {grants && grants.length > 0 ? (
                    grants.map((p) => {
                        const statusInfo = GRANT_STATUS_MAP[p.status] || {
                            label: p.status || "미정",
                            bg: "#f1f5f9",
                            color: "#475569",
                        };

                        return (
                            <div key={p.grantId} style={styles.dataCard}>
                                {/* 상단 Header*/}
                                <div style={styles.cardHeader}>
                                    <div style={styles.headerLeft}>
                                        <span style={styles.grantNumber}>
                                            {p.grantId ? `정책 NO.${String(p.grantId).padStart(5, "0")}` : "정책"}
                                        </span>
                                        {p.category && (
                                            <>
                                                <span style={styles.headerDivider}>|</span>
                                                <span style={styles.categoryTag}>
                                                    {GRANT_CATEGORY_MAP[p.category] || p.category}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor: statusInfo.bg,
                                                color: statusInfo.color,
                                            }}
                                        >
                                            {statusInfo.label}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={async () => await deleteGrant(p.grantId)}
                                            style={styles.deleteBtn}
                                            aria-label="삭제"
                                            title="삭제"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* 타이틀 및 상세 설명 */}
                                <h3 style={styles.cardTitle}>{p.title}</h3>
                                <p style={styles.cardContent}>{p.content}</p>

                                {/* 메타 정보 레이아웃 (지원금액, 지급주기, 신청기간) */}
                                <div style={styles.metaRow}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지원금액</span>
                                        <span style={styles.metaValueHighlight}>
                                            {p.amount ? (`${p.amount.toLocaleString()}만원`) : "-"}
                                        </span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지급주기</span>
                                        <span style={styles.metaValue}>
                                            {GRANT_CYCLE_MAP[p.cycle] || p.cycle || "-"}
                                        </span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>신청기간</span>
                                        <span style={styles.metaValue}>
                                            {formatDate(p.startDate)} ~ {formatDate(p.endDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>등록된 지원 사업이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>

            {/* 신규 등록 모달 (배경 클릭 시 닫힘, 내부 클릭은 전파 방지) */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div style={styles.modalTitleGroup}>
                                <span style={styles.modalBadge}>CREATE</span>
                                <h3 style={styles.modalTitle}>신규 지원사업 등록</h3>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>사업명 <span style={styles.requiredIcon}>*</span></label>
                            <input
                                style={styles.input}
                                placeholder="사업명을 입력하세요"
                                value={newProg.title}
                                onChange={e => setNewProg({ ...newProg, title: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputRow}>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>카테고리 <span style={styles.requiredIcon}>*</span></label>
                                <select
                                    style={styles.select}
                                    value={newProg.category}
                                    onChange={e => setNewProg({ ...newProg, category: e.target.value })}
                                >
                                    {Object.entries(GRANT_CATEGORY_MAP).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>지급 주기 <span style={styles.requiredIcon}>*</span></label>
                                <select
                                    style={styles.select}
                                    value={newProg.cycle}
                                    onChange={e => setNewProg({ ...newProg, cycle: e.target.value })}
                                >
                                    {Object.entries(GRANT_CYCLE_MAP).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>지원 내용 <span style={styles.requiredIcon}>*</span></label>
                            <textarea
                                style={styles.textarea}
                                placeholder="지원 내용을 상세히 입력하세요"
                                value={newProg.content}
                                onChange={e => setNewProg({ ...newProg, content: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputRow}>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>지원 금액(만원) <span style={styles.requiredIcon}>*</span></label>
                                <input
                                    style={styles.input}
                                    placeholder="예: 10"
                                    value={newProg.amount}
                                    onChange={e => setNewProg({ ...newProg, amount: e.target.value })}
                                />
                            </div>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>상태 <span style={styles.requiredIcon}>*</span></label>
                                <select
                                    style={styles.select}
                                    value={newProg.status}
                                    onChange={e => setNewProg({ ...newProg, status: e.target.value })}
                                >
                                    {Object.entries(GRANT_STATUS_MAP).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.inputRow}>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>시작 기간 <span style={styles.requiredIcon}>*</span></label>
                                <input
                                    type="date"
                                    style={styles.input}
                                    value={newProg.startDate}
                                    onChange={e => setNewProg({ ...newProg, startDate: e.target.value })}
                                />
                            </div>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>종료 기간 <span style={styles.requiredIcon}>*</span></label>
                                <input
                                    type="date"
                                    style={styles.input}
                                    value={newProg.endDate}
                                    onChange={e => setNewProg({ ...newProg, endDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={styles.modalBtns}>
                            <button
                                style={styles.modalPrimaryBtn}
                                onClick={handleCreate}
                                disabled={loading}>

                                {loading ? "등록 중..." : "등록하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: "#ffffff", width: "100%", boxSizing: "border-box" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #111111", paddingBottom: "10px" },
    titleGroup: { display: "flex", alignItems: "baseline", gap: "12px" },
    contentTitle: { fontSize: "20px", fontWeight: "bold", color: "#111111", margin: 0 },
    totalBadge: { fontSize: "14px", color: "#666666" },
    primaryBtn: { backgroundColor: "#0056b3", color: "#ffffff", border: "none", borderRadius: "6px", padding: "9px 16px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.15s ease" },
    cardList: { display: "flex", flexDirection: "column", gap: "16px" },
    dataCard: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
    grantNumber: { fontSize: "12px", fontWeight: "bold", color: "#888888", letterSpacing: "0.03em" },
    headerDivider: { fontSize: "11px", color: "#cbd5e1" },
    categoryTag: { fontSize: "12px", fontWeight: "bold", color: "#0056b3" },
    statusBadge: { padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
    cardTitle: { fontSize: "17px", fontWeight: "bold", color: "#111111", margin: 0 },
    cardContent: { fontSize: "14px", color: "#333333", lineHeight: "1.5", margin: 0, whiteSpace: "pre-line" },
    metaRow: { display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#f8f9fa", border: "1px solid #e2e8f0", padding: "10px 16px", borderRadius: "6px", marginTop: "4px", flexWrap: "wrap" },
    metaItem: { display: "flex", alignItems: "center", gap: "8px" },
    metaLabel: { fontSize: "13px", color: "#666666", fontWeight: "500" },
    metaValue: { fontSize: "13px", color: "#111111", fontWeight: "bold" },
    metaValueHighlight: { fontSize: "14px", color: "#0056b3", fontWeight: "bold" },
    metaDivider: { width: "1px", height: "12px", backgroundColor: "#cbd5e1" },
    emptyCard: { padding: "40px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" },
    emptyText: { fontSize: "14px", color: "#666666", margin: 0 },
    deleteBtn: {background: 'none', border: 'none', color: '#8c95a1', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, transition: 'all 0.15s ease',},

    /* 모달 레이아웃 */
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(2px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modal: { backgroundColor: "#ffffff", padding: "28px", borderRadius: "8px", width: "500px", maxHeight: "85vh", overflowY: "auto", border: "1px solid #e2e8f0", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", display: "flex", flexDirection: "column", gap: "16px" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" },
    modalTitleGroup: { display: "flex", alignItems: "center", gap: "8px" },
    modalBadge: { backgroundColor: "#0056b3", color: "#ffffff", fontSize: "11px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" },
    modalTitle: { fontSize: "16px", fontWeight: "bold", color: "#111111", margin: 0 },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    inputRow: { display: "flex", gap: "12px" },
    label: { fontSize: "13px", fontWeight: "bold", color: "#0056b3" },
    requiredIcon: { color: "#dc2626" },
    input: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", outline: "none", boxSizing: "border-box", width: "100%" },
    select: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", outline: "none", boxSizing: "border-box", width: "100%", cursor: "pointer" },
    textarea: { padding: "10px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", outline: "none", boxSizing: "border-box", width: "100%", height: "100px", resize: "vertical", lineHeight: "1.5", fontFamily: "inherit" },
    modalBtns: { display: "flex", marginTop: "8px" },
    modalPrimaryBtn: { width: "100%", padding: "11px 0", backgroundColor: "#0056b3", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
};