
export default function ApplicationManagement({ applications, styles }) {
    return (
        <div>
            <h2 style={styles.contentTitle}>지원금 신청 내역</h2>
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
                    <p style={styles.cardDetail}><strong>신청기간:</strong> {app.period}</p>
                    <p style={styles.cardDetail}><strong>신청일:</strong> {app.applyDate}</p>
                </div>
            ))}
        </div>
    );
}