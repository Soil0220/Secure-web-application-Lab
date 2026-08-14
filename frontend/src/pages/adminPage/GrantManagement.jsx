import {useEffect, useState} from 'react';
import {useGrant} from "../../contexts/grantContext/UseGrant.jsx";

export default function GrantManagement() {

    const {grants, createGrant, getGrants} = useGrant();
    const [showModal, setShowModal] = useState(false);
    const [newProg, setNewProg] = useState({title: '', category: '',cycle: '', content: '',  amount: '', startDate: '',endDate: '', status: '' });


    //초기 진입시 지원금 제도 불러오기
    useEffect(() => {

        const run = async () => {
            await getGrants();
        };
        run();
    }, []);

    //지원금 제도 생성
    const handleCreate = () => {
        createGrant(newProg);
        setShowModal(false);
        setNewProg({title: '', category: '',cycle: '', content: '',  amount: '', startDate: '',endDate: '', status: '' });
    };

    return (
        <div>
            <div style={styles.headerRow}>
                <h2 style={styles.title}>지원 사업 관리</h2>
                <button style={styles.primaryBtn} onClick={() => setShowModal(true)}>+ 신규 지원사업 등록</button>
            </div>

            {/* 사업 카드 목록 */}
            <div style={styles.grid}>
                {grants.map((p) => (
                    <div key={p.grantId} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.category}>{p.category}</span>
                            <span style={{ ...styles.badge, ...statusStyle[p.status] }}>{p.status}</span>
                        </div>
                        <h3 style={styles.cardTitle}>{p.title}</h3>
                        <p style={styles.cardInfo}><b>주기:</b> {p.cycle}</p>
                        <p style={styles.cardInfo}><b>설명:</b> {p.content}</p>
                        <p style={styles.cardInfo}><b>지원금액:</b> {p.amount}</p>
                        <p style={styles.cardInfo}><b>시작기간:</b> {p.startDate}</p>
                        <p style={styles.cardInfo}><b>종료기간:</b> {p.endDate}</p>
                    </div>
                ))}
            </div>

            {/* 신규 등록 모달 */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3>신규 지원사업 등록</h3>
                        <input style={styles.input} placeholder="사업명" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} />
                        <input style={styles.input} placeholder="카테고리" value={newProg.category} onChange={e => setNewProg({...newProg, category: e.target.value})} />
                        <input style={styles.input} placeholder="지급 주기" value={newProg.cycle} onChange={e => setNewProg({...newProg, cycle: e.target.value})} />
                        <input style={styles.input} placeholder="지원 내용" value={newProg.content} onChange={e => setNewProg({...newProg, content: e.target.value})} />
                        <input style={styles.input} placeholder="지원 금액" value={newProg.amount} onChange={e => setNewProg({...newProg, amount: e.target.value})} />
                        <input style={styles.input} placeholder="시작 기간" value={newProg.startDate} onChange={e => setNewProg({...newProg, startDate: e.target.value})} />
                        <input style={styles.input} placeholder="종료 기간" value={newProg.endDate} onChange={e => setNewProg({...newProg, endDate: e.target.value})} />
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