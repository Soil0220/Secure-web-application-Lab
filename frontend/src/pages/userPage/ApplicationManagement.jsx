import { useEffect, useState } from "react";
import { useApplication } from "../../contexts/applicationContext/UseApplication.jsx";
import { useDocument } from "../../contexts/documentContext/UseDocument.jsx";

const STATUS_MAP = {
    APPROVED: { label: "승인완료", bg: "#e6f4ea", color: "#137333" },
    PENDING: { label: "접수완료", bg: "#e8f0fe", color: "#1a73e8" },
    UNDER_REVIEW: { label: "심사중", bg: "#fef7e0", color: "#b06000" },
    REJECTED: { label: "반려", bg: "#fce8e6", color: "#c5221f" },
};

const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
};

export default function ApplicationManagement() {
    const { applications, getApplications, loading: appLoading } = useApplication();
    const { downloadApplicationDocument } = useDocument();

    // 개별 문서 다운로드 상태 관리 (중복 클릭 방지)
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof getApplications === "function") {
                await getApplications();
            }
        };
        fetchData();
    }, []); // 👈 의존성 배열을 빈 배열([])로 고정하여 최초 1회만 호출되도록 수정

    // applications가 배열이거나 { data: [...] } 형태일 경우 모두 안전하게 처리
    const applicationArray = Array.isArray(applications)
        ? applications
        : (applications?.data && Array.isArray(applications.data) ? applications.data : []);

    const handleDownload = async (documentId, originFilename) => {
        if (downloadingId) return;
        try {
            setDownloadingId(documentId);
            await downloadApplicationDocument(documentId, originFilename);
        } catch (error) {
            console.error("파일 다운로드 실패:", error);
            alert("파일 다운로드 중 오류가 발생했습니다.");
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div style={styles.container}>
            {/* 상단 헤더 영역 (밑줄 추가 및 스타일 통일) */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.contentTitle}>지원금 신청 내역</h2>
                    <span style={styles.totalBadge}>
                        총 <strong style={{ color: "#0056b3" }}>{applicationArray.length}</strong>건
                    </span>
                </div>
            </div>

            <div style={styles.cardList}>
                {appLoading ? (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>신청 내역을 불러오는 중입니다...</p>
                    </div>
                ) : applicationArray.length > 0 ? (
                    applicationArray.map((app) => {
                        const statusInfo = STATUS_MAP[app.status] || {
                            label: app.status || "알 수 없음",
                            bg: "#f1f5f9",
                            color: "#475569",
                        };

                        return (
                            <div key={app.applicationId} style={styles.dataCard}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.appNumber}>
                                        신청번호 NO.{String(app.applicationId).padStart(5, "0")}
                                    </span>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            backgroundColor: statusInfo.bg,
                                            color: statusInfo.color,
                                        }}
                                    >
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <h3 style={styles.cardTitle}>{app.title}</h3>

                                <div style={styles.metaRow}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>신청자</span>
                                        <span style={styles.metaValue}>{app.username || "-"}</span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>신청일시</span>
                                        <span style={styles.metaValue}>{formatDateTime(app.createdAt)}</span>
                                    </div>
                                </div>

                                {app.documents && app.documents.length > 0 && (
                                    <div style={styles.documentSection}>
                                        <div style={styles.documentHeader}>
                                            <span style={styles.documentLabel}>제출 서류</span>
                                            <span style={styles.documentCount}>총 {app.documents.length}건</span>
                                        </div>
                                        <div style={styles.fileList}>
                                            {app.documents.map((doc) => {
                                                const isDownloading = downloadingId === doc.documentId;
                                                return (
                                                    <button
                                                        key={doc.documentId}
                                                        type="button"
                                                        style={{
                                                            ...styles.fileButton,
                                                            opacity: isDownloading ? 0.6 : 1,
                                                            cursor: isDownloading ? "wait" : "pointer"
                                                        }}
                                                        onClick={() => handleDownload(doc.documentId, doc.originFilename)}
                                                        disabled={isDownloading}
                                                        title={`${doc.originFilename} 다운로드`}
                                                    >
                                                        <span style={styles.fileName}>{doc.originFilename}</span>
                                                        <span style={styles.downloadIcon}>
                                                            {isDownloading ? "..." : "↓"}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>신청 내역이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: "#ffffff",
        width: "100%",
        boxSizing: "border-box",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        borderBottom: "2px solid #111111",
        paddingBottom: "10px",
    },
    titleGroup: {
        display: "flex",
        alignItems: "baseline",
        gap: "12px",
    },
    contentTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#111111",
        margin: 0,
        letterSpacing: "-0.02em",
    },
    totalBadge: {
        fontSize: "14px",
        color: "#666666",
    },
    cardList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    dataCard: {
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    appNumber: {
        fontSize: "12px",
        fontWeight: "bold",
        color: "#888888",
        letterSpacing: "0.03em",
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
    },
    cardTitle: {
        fontSize: "17px",
        fontWeight: "bold",
        color: "#111111",
        margin: 0,
    },
    metaRow: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #e2e8f0",
        padding: "10px 16px",
        borderRadius: "6px",
        flexWrap: "wrap",
    },
    metaItem: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    metaLabel: {
        fontSize: "13px",
        color: "#666666",
        fontWeight: "500",
    },
    metaValue: {
        fontSize: "13px",
        color: "#111111",
        fontWeight: "bold",
    },
    metaDivider: {
        width: "1px",
        height: "12px",
        backgroundColor: "#cbd5e1",
    },
    documentSection: {
        marginTop: "4px",
        paddingTop: "12px",
        borderTop: "1px dashed #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    documentHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    documentLabel: {
        fontSize: "13px",
        fontWeight: "bold",
        color: "#333333",
    },
    documentCount: {
        fontSize: "12px",
        color: "#0056b3",
        fontWeight: "bold",
    },
    fileList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },
    fileButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        padding: "6px 12px",
        fontSize: "13px",
        color: "#111111",
        fontWeight: "500",
        transition: "all 0.15s ease",
    },
    fileName: {
        maxWidth: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    downloadIcon: {
        fontSize: "13px",
        color: "#0056b3",
        fontWeight: "bold",
    },
    emptyCard: {
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
    },
    emptyText: {
        fontSize: "14px",
        color: "#666666",
        margin: 0,
    },
};