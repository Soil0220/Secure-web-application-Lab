
export default function Dashboard({ applications, styles }) {
    return (
        <div>
            <h2 style={styles.contentTitle}>마이페이지 대시보드</h2>

            {/* 신청 요약 카드 */}
            <div style={styles.summaryGrid}>
                <div style={styles.summaryBox}>
                    <div style={styles.summaryLabel}>신청 진행 중</div>
                    <div style={{ ...styles.summaryValue, color: '#0066ff' }}>1건</div>
                </div>
                <div style={styles.summaryBox}>
                    <div style={styles.summaryLabel}>최근 지급 완료</div>
                    <div style={{ ...styles.summaryValue, color: '#10b981' }}>1건</div>
                </div>
                <div style={styles.summaryBox}>
                    <div style={styles.summaryLabel}>답변 대기 문의</div>
                    <div style={{ ...styles.summaryValue, color: '#d97706' }}>1건</div>
                </div>
            </div>

            <h3 style={{ ...styles.sectionTitle, marginTop: '24px' }}>최근 신청 내역</h3>
            {applications.map((app) => (
                <div key={app.id} style={styles.dataCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.categoryText}>{app.category}</span>
                        <span style={{ ...styles.statusBadge, backgroundColor: app.statusBg, color: app.statusColor }}>
              {app.status}
            </span>
                    </div>
                    <h4 style={styles.cardTitle}>{app.title}</h4>
                    <p style={styles.cardDetail}><strong>지원금액:</strong> {app.amount}</p>
                    <p style={styles.cardDetail}><strong>신청일자:</strong> {app.applyDate}</p>
                </div>
            ))}
        </div>
    );
}