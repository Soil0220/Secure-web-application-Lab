
export default function AccountManagement({ userInfo, styles }) {
    return (
        <div>
            <h2 style={styles.contentTitle}>회원정보 & 수령계좌 관리</h2>
            <div style={styles.formGroup}>
                <label style={styles.label}>이름</label>
                <input style={styles.input} type="text" value={userInfo.name} readOnly />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>이메일</label>
                <input style={styles.input} type="email" defaultValue={userInfo.email} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>휴대전화 번호</label>
                <input style={styles.input} type="text" defaultValue={userInfo.phone} />
            </div>
            <hr style={styles.hr} />
            <h3 style={styles.sectionTitle}>지원금 수령 계좌</h3>
            <div style={styles.formGroup}>
                <label style={styles.label}>은행명</label>
                <input style={styles.input} type="text" defaultValue={userInfo.bank} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>계좌번호</label>
                <input style={styles.input} type="text" defaultValue={userInfo.account} />
            </div>
            <button style={styles.primaryBtn}>변경사항 저장</button>
        </div>
    );
}