import { useState } from 'react';

export default function ProgramManagement() {
    const [programs, setPrograms] = useState([
        { id: 1, category: '청년 / 취업', name: '청년월세 특별지원금', amount: '월 최대 20만원', period: '2026.01.01 ~ 2026.12.31', status: '모집중' },
        { id: 2, category: '창업 / 소상공인', name: '초기 창업 패키지 지원', amount: '최대 1억원', period: '2026.03.01 ~ 2026.04.15', status: '모집예정' },
        { id: 3, category: '생활 / 복지', name: '긴급 생활지원금', amount: '가구당 50만원', period: '2026.01.01 ~ 2026.02.28', status: '마감' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newProg, setNewProg] = useState({ name: '', category: '청년 / 취업', amount: '', period: '', status: '모집예정' });

    const handleCreate = () => {
        if (!newProg.name) return alert('사업명을 입력해주세요.');
        setPrograms([...programs, { id: Date.now(), ...newProg }]);
        setShowModal(false);
        setNewProg({ name: '', category: '청년 / 취업', amount: '', period: '', status: '모집예정' });
    };

    return (
        <div>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>📋 지원 사업 관리</h2>
                <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>+ 신규 지원사업 등록</button>
            </div>

            {/* 사업 카드 목록 */}
            <div style={styles.grid}>
                {programs.map((p) => (
                    <div key={p.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.category}>{p.category}</span>
                            <span style={{ ...styles.badge, ...statusStyle[p.status] }}>{p.status}</span>
                        </div>
                        <h3 style={styles.cardTitle}>{p.name}</h3>
                        <p style={styles.cardInfo}><b>지원금액:</b> {p.amount}</p>
                        <p style={styles.cardInfo}><b>신청기간:</b> {p.period}</p>
                    </div>
                ))}
            </div>

            {/* 신규 등록 모달 */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>신규 지원사업 등록</h3>
                        <input style={styles.input} placeholder="사업명" value={newProg.name} onChange={e => setNewProg({...newProg, name: e.target.value})} />
                        <input style={styles.input} placeholder="카테고리 (예: 청년/취업)" value={newProg.category} onChange={e => setNewProg({...newProg, category: e.target.value})} />
                        <input style={styles.input} placeholder="지원 금액" value={newProg.amount} onChange={e => setNewProg({...newProg, amount: e.target.value})} />
                        <input style={styles.input} placeholder="신청 기간" value={newProg.period} onChange={e => setNewProg({...newProg, period: e.target.value})} />
                        <div style={styles.modalBtns}>
                            <button style={styles.primaryBtn} onClick={handleCreate}>등록</button>
                            <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const statusStyle = {
    '모집중': { backgroundColor: '#E6F4EA', color: '#137333' },
    '모집예정': { backgroundColor: '#E8F0FE', color: '#1A73E8' },
    '마감': { backgroundColor: '#F1F3F4', color: '#5F6368' }
};

const styles = {
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { fontSize: '20px', fontWeight: 'bold', color: '#111' },
    primaryBtn: { backgroundColor: '#0056B3', color: '#FFF', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
    cancelBtn: { backgroundColor: '#EEE', color: '#333', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' },
    card: { border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', backgroundColor: '#FFF' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    category: { fontSize: '13px', color: '#0056B3', fontWeight: 'bold' },
    badge: { fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' },
    cardTitle: { fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#222' },
    cardInfo: { fontSize: '14px', color: '#555', margin: '4px 0' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modal: { backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', width: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #CCC' },
    modalBtns: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }
};