
export default function UserDocuments({ styles }) {
    return (
        <div>
            <div style={styles.titleRow}>
                <h2 style={styles.contentTitle}>📁 자주 쓰는 서류 / 증빙 제출</h2>
                <button style={styles.primaryBtn}>+ 서류 새로 등록</button>
            </div>
            <div style={styles.dataCard}>
                <h4 style={styles.cardTitle}>📄 주민등록등본 (최근 3개월 이내)</h4>
                <p style={styles.cardDetail}>등록일: 2026.02.10 | 만료일: 2026.05.10</p>
            </div>
            <div style={styles.dataCard}>
                <h4 style={styles.cardTitle}>📄 소득금액증명원</h4>
                <p style={styles.cardDetail}>등록일: 2026.01.15</p>
            </div>
        </div>
    );
}