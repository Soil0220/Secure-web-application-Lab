import React, { useEffect, useState } from "react";
import NoticeList from "../../components/NoticeList.jsx";
import { useInquiry } from "../../contexts/inquiryContext/UseInquiry.jsx";
import { useNotice } from "../../contexts/noticeContext/UseNotice.jsx";

export default function NoticeManagement() {
    const [isOpen, setIsOpen] = useState(false);
    const [reload, setReload] = useState(0);
    const [tab, setTab] = useState("notice");

    // Context Hooks
    const { inquiries, getAllInquiries, updateInquiry } = useInquiry();
    const { createNotice } = useNotice();

    // 1:1 민원 상태
    const [selectedQna, setSelectedQna] = useState(null);
    const [replyText, setReplyText] = useState("");

    // 공지사항 작성 폼 상태
    const [noticeForm, setNoticeForm] = useState({
        title: "",
        content: "",
        isPinned: false,
    });
    const [noticeLoading, setNoticeLoading] = useState(false);

    // 공지사항 입력값 변경 핸들러
    const handleNoticeChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNoticeForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 공지사항 등록 제출
    const handleNoticeSubmit = async (e) => {
        e.preventDefault();

        if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
            alert("제목과 내용을 모두 입력해 주세요.");
            return;
        }

        try {
            setNoticeLoading(true);
            await createNotice(noticeForm);
            alert("공지사항이 정상적으로 등록되었습니다.");

            // 폼 초기화 및 모달 닫기
            setNoticeForm({ title: "", content: "", isPinned: false });
            handleClose();
        } catch (error) {
            console.error("공지사항 등록 실패:", error);
        } finally {
            setNoticeLoading(false);
        }
    };

    // 문의 답변 제출
    const handleReplySubmit = async (inquiryId) => {
        if (!replyText) return alert("답변을 입력해주세요.");
        await updateInquiry(inquiryId, replyText);
        setSelectedQna(null);
    };

    // 공지글 종료 및 목록 새로고침 콜백
    const handleClose = () => {
        setIsOpen(false);
        setReload((prev) => prev + 1);
    };

    useEffect(() => {
        const run = async () => {
            await getAllInquiries();
        };
        run();
    }, []);

    // inquiries가 배열이거나 { data: [...] } 객체일 경우 모두 안전하게 처리
    const inquiryArray = Array.isArray(inquiries)
        ? inquiries
        : (inquiries?.data && Array.isArray(inquiries.data) ? inquiries.data : []);

    return (
        <div style={styles.container}>
            {/* Header 영역 */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.sectionTitle}>게시판 & 민원 관리</h2>
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div style={styles.tabHeader}>
                <button
                    type="button"
                    style={{
                        ...styles.tabBtn,
                        ...(tab === "notice" ? styles.tabActive : {}),
                    }}
                    onClick={() => setTab("notice")}
                >
                    공지사항 관리
                </button>
                <button
                    type="button"
                    style={{
                        ...styles.tabBtn,
                        ...(tab === "qna" ? styles.tabActive : {}),
                    }}
                    onClick={() => setTab("qna")}
                >
                    1:1 민원 답변
                </button>
            </div>

            {/* 1. 공지사항 탭 */}
            {tab === "notice" && (
                <div style={styles.tabContent}>
                    <div style={styles.noticeHeaderRow}>
                        <span style={styles.subText}>
                            서비스 사용자들에게 전달할 공지사항을 등록 및 관리합니다.
                        </span>
                        <button
                            type="button"
                            style={styles.primaryBtn}
                            onClick={() => setIsOpen(true)}
                        >
                            + 공지사항 작성
                        </button>
                    </div>

                    {/* 공지사항 목록 */}
                    <div style={styles.noticeListWrapper}>
                        <NoticeList reload={reload} />
                    </div>

                    {/* 공지사항 작성 모달 (오버레이 클릭 시 닫힘) */}
                    {isOpen && (
                        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
                            <div
                                style={styles.noticeModalContent}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={styles.modalHeaderRow}>
                                    <div style={styles.modalBadgeGroup}>
                                        <span style={styles.headerBadge}>NOTICE</span>
                                        <h3 style={styles.modalTitle}>공지사항 작성</h3>
                                    </div>
                                </div>

                                <form onSubmit={handleNoticeSubmit}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>
                                            제목 <span style={styles.requiredIcon}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={noticeForm.title}
                                            onChange={handleNoticeChange}
                                            placeholder="공지사항 제목을 입력하세요"
                                            style={styles.input}
                                            required
                                        />
                                    </div>

                                    <div style={styles.pinnedBox}>
                                        <label htmlFor="isPinned" style={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                id="isPinned"
                                                name="isPinned"
                                                checked={noticeForm.isPinned}
                                                onChange={handleNoticeChange}
                                                style={styles.checkbox}
                                            />
                                            <span>상단 고정 공지로 등록</span>
                                        </label>
                                    </div>

                                    <div style={styles.formGroup}>
                                        <label style={styles.inputLabel}>
                                            내용 <span style={styles.requiredIcon}>*</span>
                                        </label>
                                        <textarea
                                            name="content"
                                            value={noticeForm.content}
                                            onChange={handleNoticeChange}
                                            placeholder="공지사항 내용을 상세히 입력하세요"
                                            style={styles.textareaNotice}
                                            required
                                        />
                                    </div>

                                    <div style={styles.btnGroup}>
                                        <button
                                            type="submit"
                                            style={{ ...styles.primaryBtnModal, width: "100%" }}
                                            disabled={noticeLoading}
                                        >
                                            {noticeLoading ? "등록 중..." : "등록하기"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. 1:1 민원 탭 */}
            {tab === "qna" && (
                <div style={styles.tabContent}>
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                            <tr style={styles.thRow}>
                                <th style={{ ...styles.th, width: "20%" }}>작성자</th>
                                <th style={{ ...styles.th, width: "65%" }}>민원 제목</th>
                                <th style={{ ...styles.th, width: "15%", textAlign: "center" }}>
                                    처리 상태
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {inquiryArray && inquiryArray.length > 0 ? (
                                inquiryArray.map((q) => {
                                    const isAnswered = q.status === "ANSWERED";
                                    return (
                                        <tr
                                            key={q.inquiryId}
                                            style={styles.trRow}
                                            onClick={() => {
                                                setSelectedQna(q);
                                                setReplyText(q.answer || "");
                                            }}
                                        >
                                            <td style={styles.td}>
                                                <span style={styles.usernameText}>{q.username}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.qnaTitle}>{q.title}</span>
                                            </td>
                                            <td style={{ ...styles.td, textAlign: "center" }}>
                                                    <span
                                                        style={{
                                                            ...styles.statusBadge,
                                                            backgroundColor: isAnswered ? "#f0fdf4" : "#fff7ed",
                                                            color: isAnswered ? "#16a34a" : "#c2410c",
                                                        }}
                                                    >
                                                        {isAnswered ? "답변완료" : "답변대기"}
                                                    </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} style={styles.emptyTd}>
                                        등록된 민원 내역이 없습니다.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    {/* 민원 답변 모달 (오버레이 클릭 시 닫힘) */}
                    {selectedQna && (
                        <div
                            style={styles.modalOverlay}
                            onClick={() => setSelectedQna(null)}
                        >
                            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                                <div style={styles.modalHeader}>
                                    <div style={styles.modalBadgeGroup}>
                                        <span style={styles.modalBadge}>ANSWER</span>
                                        <h3 style={styles.modalTitle}>1:1 민원 답변 작성</h3>
                                    </div>
                                </div>

                                <div style={styles.modalBody}>
                                    <div style={styles.qnaInfoBox}>
                                        <div style={styles.qnaMeta}>
                                            <span style={styles.qnaUser}>
                                                작성자: <strong style={{ color: "#111111" }}>{selectedQna.username}</strong>
                                            </span>
                                        </div>
                                        <div style={styles.qnaQuestionTitle}>
                                            {selectedQna.title}
                                        </div>
                                        {/* 민원 내용(content) 표시 영역 추가 */}
                                        <div style={styles.qnaContentBox}>
                                            {selectedQna.content || "내용이 없습니다."}
                                        </div>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}>답변 내용</label>
                                        <textarea
                                            style={styles.textarea}
                                            rows="6"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="신청자에게 전달할 답변을 상세히 작성해주세요..."
                                        />
                                    </div>
                                </div>

                                <div style={styles.modalBtns}>
                                    <button
                                        type="button"
                                        style={styles.primaryBtnModal}
                                        onClick={() => handleReplySubmit(selectedQna.inquiryId)}
                                    >
                                        답변 등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// 지원금24 대시보드 통합 스타일
const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: "#ffffff",
        width: "100%",
        boxSizing: "border-box",
    },
    headerRow: {
        marginBottom: "20px",
        borderBottom: "2px solid #111111",
        paddingBottom: "10px",
    },
    titleGroup: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
    },
    sectionTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#111111",
        margin: 0,
    },

    /* 탭 헤더 */
    tabHeader: {
        display: "flex",
        gap: "8px",
        borderBottom: "1px solid #e2e8f0",
        marginBottom: "20px",
    },
    tabBtn: {
        padding: "10px 18px",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "bold",
        color: "#666666",
        borderBottom: "2px solid transparent",
        transition: "all 0.15s ease",
    },
    tabActive: {
        color: "#0056b3",
        borderBottom: "2px solid #0056b3",
    },

    tabContent: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    /* 공지사항 탭 스타일 */
    noticeHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    subText: {
        fontSize: "14px",
        color: "#666666",
    },
    noticeListWrapper: {
        width: "100%",
    },

    /* 민원 탭 (테이블 Card 형태) */
    tableCard: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
    },
    thRow: {
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e2e8f0",
    },
    th: {
        padding: "14px 16px",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#333333",
    },
    trRow: {
        borderBottom: "1px solid #edf2f7",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
    },
    td: {
        padding: "14px 16px",
        fontSize: "14px",
        verticalAlign: "middle",
        color: "#333333",
    },
    usernameText: {
        fontWeight: "bold",
        color: "#111111",
    },
    qnaTitle: {
        color: "#333333",
        fontWeight: "500",
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
        display: "inline-block",
    },
    emptyTd: {
        padding: "40px",
        textAlign: "center",
        color: "#666666",
        fontSize: "14px",
    },

    /* 버튼 스타일 */
    primaryBtn: {
        backgroundColor: "#0056b3",
        color: "#ffffff",
        border: "none",
        padding: "9px 16px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.15s ease",
    },
    primaryBtnModal: {
        width: "100%",
        backgroundColor: "#0056b3",
        color: "#ffffff",
        border: "none",
        padding: "11px 0",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    /* 모달 레이아웃 공통 */
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(2px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    /* 공지사항 모달 컨텐츠 */
    noticeModalContent: {
        position: "relative",
        backgroundColor: "#ffffff",
        padding: "28px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "580px",
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e2e8f0",
    },
    modalHeaderRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #e2e8f0",
    },
    modalBadgeGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    headerBadge: {
        backgroundColor: "#0056b3",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "bold",
        padding: "2px 6px",
        borderRadius: "4px",
    },
    formGroup: {
        marginBottom: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    requiredIcon: {
        color: "#dc2626",
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        backgroundColor: "#ffffff",
        fontSize: "14px",
        color: "#111111",
        boxSizing: "border-box",
        outline: "none",
    },
    textareaNotice: {
        width: "100%",
        height: "160px",
        padding: "12px 14px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        backgroundColor: "#ffffff",
        fontSize: "14px",
        color: "#111111",
        boxSizing: "border-box",
        resize: "vertical",
        outline: "none",
        lineHeight: "1.5",
        fontFamily: "inherit",
    },
    pinnedBox: {
        backgroundColor: "#eef6ff",
        border: "1px solid #d0e2ff",
        borderRadius: "6px",
        padding: "10px 14px",
        marginBottom: "18px",
        width: "fit-content",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "bold",
        color: "#0056b3",
    },
    checkbox: {
        width: "16px",
        height: "16px",
        cursor: "pointer",
        accentColor: "#0056b3",
    },
    btnGroup: {
        display: "flex",
        marginTop: "20px",
    },

    /* 민원 답변 모달 */
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(2px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        width: "480px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        border: "1px solid #e2e8f0",
    },
    modalHeader: {
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "12px",
    },
    modalBadge: {
        backgroundColor: "#0056b3",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "bold",
        padding: "2px 6px",
        borderRadius: "4px",
    },
    modalTitle: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#111111",
        margin: 0,
    },
    modalBody: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    qnaInfoBox: {
        backgroundColor: "#f8f9fa",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    qnaMeta: {
        fontSize: "12px",
        color: "#666666",
    },
    qnaUser: {
        color: "#333333",
    },
    qnaQuestionTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#111111",
        lineHeight: "1.4",
    },
    qnaContentBox: {
        fontSize: "13px",
        color: "#475569",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "4px",
        padding: "10px",
        marginTop: "4px",
        whiteSpace: "pre-wrap",
        lineHeight: "1.5",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    inputLabel: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#0056b3",
    },
    textarea: {
        padding: "10px 12px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        resize: "vertical",
        lineHeight: "1.5",
        backgroundColor: "#ffffff",
        color: "#111111",
        boxSizing: "border-box",
    },
    modalBtns: {
        display: "flex",
        marginTop: "4px",
    },
};