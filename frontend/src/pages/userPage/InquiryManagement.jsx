import { useEffect, useState } from "react";
import { useInquiry } from "../../contexts/inquiryContext/UseInquiry.jsx";
import {INQUIRY_STATUS_MAP} from "../../constants/status.jsx";


/*
    문의 관리
    1. 문의 상태, 날짜 포맷팅 정의
    2. useInquiry를 통한 전체 문의 조회 및 문의 생성 함수 등록
    3. openInquiryId, isOpen을 통한 관리자 답변 창 선택적 ON/OFF
    4. showModal을 이용한 문의 작성 창 ON/OFF
    5. loading을 통한 중복 요청 방지
*/


// 날짜 포맷팅
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hour}:${minute}`;
};

export default function InquiryManagement() {
    const { inquiries, getInquiries, createInquiry } = useInquiry();
    const [openInquiryId, setOpenInquiryId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
            title: "",
            content: "",
            link: ""});
    const [loading, setLoading] = useState(false);

    const inquiryArray = inquiries;

    const handleCreateInquiry = async (e) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            setLoading(true);
            await createInquiry(formData.title, formData.content, formData.link);
            alert("문의가 정상적으로 등록되었습니다.");
            setFormData({
                title : "",
                content: "",
                link: ""
            });
            setShowModal(false);
            getInquiries();
        } catch (error) {
            console.error("문의 등록 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            await getInquiries();
        };
        fetchData();
    }, []);

    return (
        <div style={styles.container}>
            {/* 상단 Header */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.sectionTitle}>1:1 문의 내역</h2>
                    <span style={styles.totalBadge}>
                        총 <strong style={{ color: "#0056b3" }}>{inquiryArray.length}</strong>건
                    </span>
                </div>
                <button
                    type="button"
                    style={styles.primaryBtn}
                    onClick={() => setShowModal(true)}
                >
                    + 새 문의 작성
                </button>
            </div>

            {/* 문의 목록 */}
            <div style={styles.cardList}>
                {inquiryArray.length > 0 ? (
                    inquiryArray.map((inq) => {
                        const statusInfo = INQUIRY_STATUS_MAP[inq.status] || { label: inq.status, bg: "#f8f9fa", color: "#666666" };
                        const isOpen = openInquiryId === inq.inquiryId;

                        return (
                            <div key={inq.inquiryId} style={styles.dataCard}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.headerLeft}>
                                        <span style={styles.inquiryNumber}>NO.{String(inq.inquiryId).padStart(5, "0")}</span>
                                        <span style={styles.authorText}>작성자: <strong>{inq.username || "-"}</strong></span>
                                    </div>
                                    <span style={{ ...styles.statusBadge, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                <h3 style={styles.cardTitle}>{inq.title}</h3>
                                <p style={styles.cardContent}>{inq.content}</p>

                                {inq.answer && (
                                    <div style={styles.answerWrapper}>
                                        <button
                                            type="button"
                                            style={styles.toggleBtn}
                                            onClick={() => setOpenInquiryId((prev) => (prev === inq.inquiryId ? null : inq.inquiryId))}
                                        >
                                            <span>💬 답변 {isOpen ? "접기" : "확인하기"}</span>
                                            <span>{isOpen ? "▲" : "▼"}</span>
                                        </button>
                                        {isOpen && (
                                            <div style={styles.answerBox}>
                                                <div style={styles.answerHeader}>
                                                    <span style={styles.answerTitle}>관리자 답변</span>
                                                    <span style={styles.answerDate}>{formatDateTime(inq.answeredAt)}</span>
                                                </div>
                                                <p style={styles.answerText}>{inq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>등록된 문의 내역이 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 새 문의 작성 모달 (오버레이 클릭 시 닫힘, 내부 클릭은 전파 방지) */}
            {showModal && (
                <div style={styles.overlay} onClick={() => setShowModal(false)}>
                    <div style={styles.noticeModalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeaderRow}>
                            <div style={styles.modalBadgeGroup}>
                                <span style={styles.headerBadge}>INQUIRY</span>
                                <h3 style={styles.modalTitle}>새 문의 작성</h3>
                            </div>
                        </div>

                        <form onSubmit={handleCreateInquiry}>
                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>
                                    제목 <span style={styles.requiredIcon}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    name="title"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="문의 제목을 입력하세요"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.inputLabel}>
                                    내용 <span style={styles.requiredIcon}>*</span>
                                </label>
                                <textarea
                                    value={formData.content}
                                    name="content"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="문의 내용을 상세히 입력하세요"
                                    style={styles.textareaNotice}
                                    required
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <div style={styles.labelGroup}>
                                    <label style={styles.inputLabel}>
                                        참고링크
                                    </label>
                                </div>
                                <input
                                    type="url"
                                    value={formData.link}
                                    name="link"
                                    onChange={(e) => handleChange(e)}
                                    placeholder="https://example.com"
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.btnGroup}>
                                <button
                                    type="submit"
                                    style={{ ...styles.primaryBtn, width: "100%" }}
                                    disabled={loading}
                                >
                                    {loading ? "등록 중..." : "등록하기"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", width: "100%", backgroundColor: "#ffffff", boxSizing: "border-box" },
    headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "2px solid #111111", paddingBottom: "10px" },
    titleGroup: { display: "flex", alignItems: "baseline", gap: "12px" },
    sectionTitle: { fontSize: "20px", fontWeight: "bold", color: "#111111", margin: 0 },
    totalBadge: { fontSize: "14px", color: "#666666" },

    cardList: { display: "flex", flexDirection: "column", gap: "16px" },
    dataCard: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px" },
    cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
    headerLeft: { display: "flex", gap: "12px", alignItems: "center" },
    inquiryNumber: { fontSize: "12px", fontWeight: "bold", color: "#64748b" },
    authorText: { fontSize: "13px", color: "#666666" },
    statusBadge: { padding: "4px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold", display: "inline-block" },
    cardTitle: { fontSize: "16px", fontWeight: "bold", color: "#111111", margin: "0 0 8px 0" },
    cardContent: { fontSize: "14px", color: "#333333", margin: 0, lineHeight: "1.6" },
    answerWrapper: { marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed #e2e8f0" },
    toggleBtn: { width: "100%", display: "flex", justifyContent: "space-between", background: "none", border: "none", color: "#0056b3", fontSize: "13px", fontWeight: "bold", cursor: "pointer" },
    answerBox: { backgroundColor: "#f8f9fa", borderRadius: "6px", padding: "16px", marginTop: "10px", border: "1px solid #e2e8f0" },
    answerHeader: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
    answerTitle: { fontSize: "13px", fontWeight: "bold", color: "#111111" },
    answerDate: { fontSize: "12px", color: "#888888" },
    answerText: { fontSize: "14px", color: "#333333", margin: 0, lineHeight: "1.6" },
    emptyCard: { padding: "32px", textAlign: "center", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e2e8f0" },
    emptyText: { fontSize: "14px", color: "#666666", margin: 0 },

    primaryBtn: { backgroundColor: "#0056b3", color: "#ffffff", border: "none", padding: "11px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", transition: "background-color 0.15s ease", boxSizing: "border-box" },

    /* 모달 레이아웃 */
    overlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(2px)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" },
    noticeModalContent: { position: "relative", backgroundColor: "#ffffff", padding: "28px", borderRadius: "8px", width: "90%", maxWidth: "580px", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", border: "1px solid #e2e8f0" },
    modalHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #e2e8f0" },
    modalBadgeGroup: { display: "flex", alignItems: "center", gap: "8px" },
    headerBadge: { backgroundColor: "#0056b3", color: "#ffffff", fontSize: "11px", fontWeight: "bold", padding: "2px 6px", borderRadius: "4px" },
    modalTitle: { fontSize: "16px", fontWeight: "bold", color: "#111111", margin: 0 },
    formGroup: { marginBottom: "18px", display: "flex", flexDirection: "column", gap: "6px" },
    labelGroup: {display: "flex", alignItems: "center", gap: "8px"},
    subLabel: {fontSize: "11px", color: "#888888", fontWeight: "normal"},
    inputLabel: { fontSize: "12px", fontWeight: "bold", color: "#0056b3" },
    requiredIcon: { color: "#dc2626" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", boxSizing: "border-box", outline: "none" },
    textareaNotice: { width: "100%", height: "160px", padding: "12px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", fontSize: "14px", color: "#111111", boxSizing: "border-box", resize: "vertical", outline: "none", lineHeight: "1.5", fontFamily: "inherit" },
    btnGroup: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "20px" }
};