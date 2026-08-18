import { useEffect, useState } from "react";
import { useFavorite } from "../../contexts/favoriteContext/UseFavorite.jsx";
import ApplicationForm from "../../components/ApplicationForm";

// 백엔드 GrantStatus Enum 반영 (RECRUITING, CLOSED, PREPARING)
const STATUS_MAP = {
    RECRUITING: { label: "모집중", bg: "#e6f4ea", color: "#137333" },
    PREPARING: { label: "준비중", bg: "#fef7e0", color: "#b06000" },
    CLOSED: { label: "마감", bg: "#fce8e6", color: "#c5221f" },
};

const CYCLE_MAP = { WEEKLY: "주간", MONTHLY: "월간", YEARLY: "연간", ONCE: "1회성" };

const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

export default function FavoriteManagement() {
    const { favorites, getFavorites } = useFavorite();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof getFavorites === "function") {
                await getFavorites();
            }
        };
        fetchData();
    }, []);

    const favoriteArray = Array.isArray(favorites)
        ? favorites
        : (favorites?.data && Array.isArray(favorites.data) ? favorites.data : []);

    return (
        <div style={styles.container}>
            {/* 상단 Header */}
            <div style={styles.headerRow}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.sectionTitle}>관심목록</h2>
                    <span style={styles.totalBadge}>
                        총 <strong style={{ color: "#0056b3" }}>{favoriteArray.length}</strong>건
                    </span>
                </div>
            </div>

            {/* 관심목록 리스트 */}
            <div style={styles.cardList}>
                {favoriteArray.length > 0 ? (
                    favoriteArray.map((favorite) => {
                        const statusInfo = STATUS_MAP[favorite.status] || { label: favorite.status, bg: "#f8f9fa", color: "#666666" };
                        const cycleLabel = CYCLE_MAP[favorite.cycle] || favorite.cycle || "-";

                        return (
                            <div key={favorite.grantId} style={styles.dataCard}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.grantNumber}>정책 NO.{String(favorite.grantId).padStart(5, "0")}</span>
                                    <span style={{ ...styles.statusBadge, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                                <h3 style={styles.cardTitle}>{favorite.title}</h3>
                                <p style={styles.cardContent}>{favorite.content}</p>

                                <div style={styles.metaRow}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지원금액</span>
                                        <span style={styles.metaValueHighlight}>{favorite.amount ? `${favorite.amount.toLocaleString()}만원` : "-"}</span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지급주기</span>
                                        <span style={styles.metaValue}>{cycleLabel}</span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>신청기간</span>
                                        <span style={styles.metaValue}>{formatDate(favorite.startDate)} ~ {formatDate(favorite.endDate)}</span>
                                    </div>
                                </div>
                                <div style={styles.cardFooter}>
                                    <button style={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                                        바로 신청하기
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyCard}><p style={styles.emptyText}>관심 등록된 정책이 없습니다.</p></div>
                )}
            </div>

            {/* 지원금 신청 모달 연동 */}
            <ApplicationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", width: "100%" },
    headerRow: { marginBottom: "20px", borderBottom: "2px solid #111111", paddingBottom: "10px" },
    titleGroup: { display: "flex", alignItems: "baseline", gap: "12px" },
    sectionTitle: { fontSize: "20px", fontWeight: "bold", color: "#111111", margin: 0 },
    totalBadge: { fontSize: "14px", color: "#666666" },
    cardList: { display: "flex", flexDirection: "column", gap: "16px" },
    dataCard: { backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px" },
    cardHeader: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
    grantNumber: { fontSize: "12px", fontWeight: "bold", color: "#64748b" },
    statusBadge: { padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
    cardTitle: { fontSize: "17px", fontWeight: "bold", color: "#111111", margin: "0 0 8px 0" },
    cardContent: { fontSize: "14px", color: "#333333", margin: "0 0 16px 0", lineHeight: "1.6" },
    metaRow: { display: "flex", alignItems: "center", gap: "16px", backgroundColor: "#f8f9fa", padding: "12px 16px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "16px" },
    metaItem: { display: "flex", alignItems: "center", gap: "8px" },
    metaLabel: { fontSize: "13px", color: "#666666" },
    metaValue: { fontSize: "13px", fontWeight: "bold", color: "#111111" },
    metaValueHighlight: { fontSize: "14px", fontWeight: "bold", color: "#0056b3" },
    metaDivider: { width: "1px", height: "12px", backgroundColor: "#cbd5e1" },
    cardFooter: { display: "flex", justifyContent: "flex-end" },
    primaryBtn: { backgroundColor: "#0056b3", color: "#ffffff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "14px", fontWeight: "bold", cursor: "pointer" },
    emptyCard: { padding: "32px", textAlign: "center", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e2e8f0" },
    emptyText: { fontSize: "14px", color: "#666666", margin: 0 }
};