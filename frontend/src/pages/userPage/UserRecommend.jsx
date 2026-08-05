import React from 'react';

export default function UserRecommend({ recommendedGrants, styles }) {
    return (
        <div>
            <h2 style={styles.contentTitle}>⭐ 맞춤 지원금 & 관심목록</h2>
            {recommendedGrants.map((grant) => (
                <div key={grant.id} style={styles.dataCard}>
                    <div style={styles.cardHeader}>
                        <span style={styles.categoryText}>{grant.category}</span>
                        <span style={{ ...styles.statusBadge, backgroundColor: grant.tagBg, color: grant.tagColor }}>
              {grant.tag}
            </span>
                    </div>
                    <h4 style={styles.cardTitle}>{grant.title}</h4>
                    <p style={styles.cardDetail}><strong>지원금액:</strong> {grant.amount}</p>
                    <p style={styles.cardDetail}><strong>신청기간:</strong> {grant.period}</p>
                    <button style={styles.primaryBtn}>바로 신청하기</button>
                </div>
            ))}
        </div>
    );
}