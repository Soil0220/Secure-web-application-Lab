import { useState } from 'react';
import {useApplication} from "../../contexts/applicationContext/UseApplication.jsx";

export default function ApplicationManagement() {
    /*
    const [applicants, setApplicants] = useState([
        { id: 1, name: '김철수', program: '청년월세 특별지원금', date: '2026-07-28', status: '접수완료', doc: '등본_김철수.pdf' },
        { id: 2, name: '이영희', program: '초기 창업 패키지 지원', date: '2026-07-29', status: '심사중', doc: '사업계획서_이영희.pdf' },
        { id: 3, name: '박민수', program: '긴급 생활지원금', date: '2026-07-30', status: '승인', doc: '소득증명_박민수.pdf' },
    ]);
     */

    const {apllications, setApplications, getAllApplications} = useApplication();
    const [selected, setSelected] = useState(null);

    const handleAudit = (id, newStatus) => {
        setApplicants(applicants.map(a => a.id === id ? { ...a, status: newStatus } : a));
        setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    };

    return (
        <div>
            <h2 style={styles.title}>신청자 심사 및 관리</h2>

            <div style={styles.splitLayout}>
                {/* 신청자 목록 테이블 */}
                <div style={{ flex: 1 }}>
                    <table style={styles.table}>
                        <thead>
                        <tr style={styles.thRow}>
                            <th>신청자</th>
                            <th>신청 사업</th>
                            <th>신청일</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {applicants.map(app => (
                            <tr
                                key={app.id}
                                style={{ ...styles.trRow, backgroundColor: selected?.id === app.id ? '#F0F7FF' : 'transparent' }}
                                onClick={() => setSelected(app)}
                            >
                                <td style={styles.td}><b>{app.name}</b></td>
                                <td style={styles.td}>{app.program}</td>
                                <td style={styles.td}>{app.date}</td>
                                <td style={styles.td}><span style={statusBadge[app.status]}>{app.status}</span></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 상세 심사 우측 패널 */}
                {selected && (
                    <div style={styles.detailPanel}>
                        <h3>서류 심사 상세</h3>
                        <p><b>신청자명:</b> {selected.name}</p>
                        <p><b>신청 사업:</b> {selected.program}</p>
                        <p><b>제출 서류:</b> <a href="#doc" onClick={(e) => { e.preventDefault(); alert('서류 미리보기 기능'); }}>{selected.doc}</a></p>
                        <p><b>현재 상태:</b> {selected.status}</p>

                        <div style={styles.actionBtns}>
                            <button style={styles.approveBtn} onClick={() => handleAudit(selected.id, '승인')}>승인 처리</button>
                            <button style={styles.rejectBtn} onClick={() => handleAudit(selected.id, '반려')}>반려 처리</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const statusBadge = {
    '접수완료': { color: '#E65100', fontWeight: 'bold' },
    '심사중': { color: '#0D47A1', fontWeight: 'bold' },
    '승인': { color: '#1B5E20', fontWeight: 'bold' },
    '반려': { color: '#B71C1C', fontWeight: 'bold' },
};

const styles = {
    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111' },
    splitLayout: { display: 'flex', gap: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', borderTop: '2px solid #0056B3' },
    thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', height: '40px' },
    trRow: { borderBottom: '1px solid #E2E8F0', cursor: 'pointer', height: '48px' },
    td: { padding: '8px 12px', fontSize: '14px' },
    detailPanel: { width: '300px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' },
    actionBtns: { display: 'flex', gap: '8px', marginTop: '20px' },
    approveBtn: { flex: 1, backgroundColor: '#2E7D32', color: '#FFF', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
    rejectBtn: { flex: 1, backgroundColor: '#C62828', color: '#FFF', border: 'none', padding: '8px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
};