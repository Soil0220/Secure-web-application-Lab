import React, { useEffect, useState } from "react";
import { useApplication } from "../../contexts/applicationContext/UseApplication.jsx";
import { useDocument } from "../../contexts/documentContext/UseDocument.jsx";

// 상태 배지 매핑
const STATUS_MAP = {
    SUBMITTED: { label: "제출완료", bg: "#fff7ed", color: "#c2410c" },
    UNDER_REVIEW: { label: "심사중", bg: "#eef6ff", color: "#0056b3" },
    APPROVED: { label: "승인완료", bg: "#f0fdf4", color: "#16a34a" },
    REJECTED: { label: "반려됨", bg: "#fef2f2", color: "#dc2626" },
};

// 날짜 포맷팅 (YYYY.MM.DD)
const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
};

export default function ApplicationManagement() {
    const { applications, getAllApplications, updateApplicationStatus } = useApplication();
    const { downloadApplicationDocument } = useDocument();
    const [selected, setSelected] = useState(null);

    // 신청서 상태변경
    const handleAudit = async (applicationId, status) => {
        await updateApplicationStatus(applicationId, status);
    };

    const handleDocumentClick = async (documentId, documentName) => {
        await downloadApplicationDocument(documentId, documentName);
    };

    useEffect(() => {
        const run = async () => {
            await getAllApplications();
        };
        run();
    }, []);

    return (
        <div style={styles.container}>
            {/* Header 영역 */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.sectionTitle}>신청자 심사 및 관리</h2>
                    <span style={styles.totalBadge}>
                        총 <strong>{applications?.length || 0}</strong>건
                    </span>
                </div>
            </div>

            <div style={styles.splitLayout}>
                {/* 1. 신청자 목록 테이블 */}
                <div style={styles.tableCard}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.thRow}>
                            <th style={{ ...styles.th, width: "25%" }}>신청자</th>
                            <th style={{ ...styles.th, width: "40%" }}>신청 사업</th>
                            <th style={{ ...styles.th, width: "20%" }}>신청일</th>
                            <th style={{ ...styles.th, width: "15%", textAlign: "center" }}>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applications && applications.length > 0 ? (
                            applications.map((app) => {
                                const isSelected = selected?.applicationId === app.applicationId;
                                const statusInfo = STATUS_MAP[app.status] || {
                                    label: app.status || "미정",
                                    bg: "#f1f5f9",
                                    color: "#475569",
                                };

                                return (
                                    <tr
                                        key={app.applicationId}
                                        style={{
                                            ...styles.trRow,
                                            backgroundColor: isSelected ? "#eef6ff" : "transparent",
                                        }}
                                        onClick={() => setSelected(app)}
                                    >
                                        <td style={styles.td}>
                                            <div style={styles.applicantInfo}>
                                                {app.applicationId && (
                                                    <span style={styles.applicantId}>
                                                            신청 NO.{String(app.applicationId).padStart(5, "0")}
                                                        </span>
                                                )}
                                                <span style={styles.applicantName}>{app.username}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.appTitle}>{app.title}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.dateText}>{formatDate(app.createdAt)}</span>
                                        </td>
                                        <td style={{ ...styles.td, textAlign: "center" }}>
                                                <span
                                                    style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: statusInfo.bg,
                                                        color: statusInfo.color,
                                                    }}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} style={styles.emptyTd}>
                                    신청 내역이 존재하지 않습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* 2. 상세 심사 우측 패널 */}
                {selected && (
                    <div style={styles.detailPanel}>
                        <div style={styles.panelHeader}>
                            <div style={styles.panelTitleGroup}>
                                <span style={styles.panelBadge}>AUDIT</span>
                                <h3 style={styles.panelTitle}>서류 심사 상세</h3>
                            </div>
                            <button
                                type="button"
                                style={styles.closeBtn}
                                onClick={() => setSelected(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={styles.panelContent}>
                            <div style={styles.infoGroup}>
                                <label style={styles.infoLabel}>신청 번호</label>
                                <div style={styles.infoValueHighlight}>
                                    신청 NO.{String(selected.applicationId).padStart(5, "0")}
                                </div>
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.infoLabel}>신청자명</label>
                                <div style={styles.infoValueHighlight}>{selected.username}</div>
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.infoLabel}>신청 사업</label>
                                <div style={styles.infoValue}>{selected.title}</div>
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.infoLabel}>제출 서류</label>
                                <div style={styles.docBox}>
                                    {selected?.documents && selected.documents.length > 0 ? (
                                        selected.documents.map((doc, index) => (
                                            <React.Fragment key={doc.documentId || index}>
                                                <a
                                                    href="#doc"
                                                    style={styles.docLink}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDocumentClick(doc.documentId, doc.originFilename);
                                                    }}
                                                >
                                                    {doc.originFilename}
                                                </a>
                                                {index < selected.documents.length - 1 && (
                                                    <div style={styles.docDivider} />
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <span style={styles.noDocText}>제출된 서류가 없습니다.</span>
                                    )}
                                </div>
                            </div>

                            <div style={styles.infoGroup}>
                                <label style={styles.infoLabel}>현재 상태</label>
                                <div>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            backgroundColor: (STATUS_MAP[selected.status] || {}).bg || "#f1f5f9",
                                            color: (STATUS_MAP[selected.status] || {}).color || "#475569",
                                        }}
                                    >
                                        {(STATUS_MAP[selected.status] || {}).label || selected.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 심사 처리 버튼 */}
                        <div style={styles.actionBtns}>
                            <button
                                type="button"
                                style={styles.approveBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAudit(selected.applicationId, "APPROVED");
                                }}
                            >
                                승인 처리
                            </button>
                            <button
                                type="button"
                                style={styles.rejectBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAudit(selected.applicationId, "REJECTED");
                                }}
                            >
                                반려 처리
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 지원금24 표준 통합 UI 스타일
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
    totalBadge: {
        fontSize: "14px",
        color: "#666666",
    },
    splitLayout: {
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
    },
    tableCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
        transition: "all 0.15s ease",
    },
    td: {
        padding: "14px 16px",
        fontSize: "14px",
        verticalAlign: "middle",
        color: "#333333",
    },
    applicantInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    applicantId: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#0056b3",
    },
    applicantName: {
        fontWeight: "bold",
        color: "#111111",
        fontSize: "14px",
    },
    appTitle: {
        color: "#333333",
        fontWeight: "500",
    },
    dateText: {
        color: "#666666",
        fontSize: "13px",
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

    /* 우측 상세 패널 */
    detailPanel: {
        width: "320px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "20px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        boxSizing: "border-box",
    },
    panelHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "12px",
        borderBottom: "1px solid #e2e8f0",
    },
    panelTitleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    panelBadge: {
        backgroundColor: "#0056b3",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "bold",
        padding: "2px 6px",
        borderRadius: "4px",
    },
    panelTitle: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#111111",
        margin: 0,
    },
    closeBtn: {
        backgroundColor: "transparent",
        border: "none",
        fontSize: "16px",
        color: "#666666",
        cursor: "pointer",
        padding: "0 4px",
    },
    panelContent: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
    },
    infoGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    infoLabel: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#0056b3",
    },
    infoValue: {
        fontSize: "14px",
        color: "#333333",
        lineHeight: "1.4",
    },
    infoValueHighlight: {
        fontSize: "15px",
        color: "#111111",
        fontWeight: "bold",
    },
    docBox: {
        backgroundColor: "#eef6ff",
        border: "1px solid #d0e2ff",
        borderRadius: "6px",
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    docLink: {
        color: "#0056b3",
        fontSize: "13px",
        fontWeight: "bold",
        textDecoration: "none",
        wordBreak: "break-all",
    },
    docDivider: {
        height: "1px",
        backgroundColor: "#d0e2ff",
    },
    noDocText: {
        fontSize: "12px",
        color: "#666666",
    },
    actionBtns: {
        display: "flex",
        gap: "10px",
        marginTop: "6px",
    },
    approveBtn: {
        flex: 1,
        backgroundColor: "#0056b3",
        color: "#ffffff",
        border: "none",
        padding: "10px 0",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: "#dc2626",
        color: "#ffffff",
        border: "none",
        padding: "10px 0",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: "bold",
        cursor: "pointer",
    },
};