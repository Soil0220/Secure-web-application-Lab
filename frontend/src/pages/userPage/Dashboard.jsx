export default function Dashboard({ applications, styles }) {
    return (
        <div>
            <h2 style={{ ...styles.contentTitle, marginBottom: '24px' }}>마이페이지 대시보드</h2>

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

            {/* "최근 신청 내역" 제목과 요약 카드 사이의 간격을 넓히고 밑줄이 생기지 않도록 분리 */}
            <h3 style={{
                ...styles.sectionTitle,
                marginTop: '36px',
                marginBottom: '16px',
                borderBottom: 'none',
                paddingBottom: '0'
            }}>
                최근 신청 내역
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
        </div>
    );
}