import React from 'react';
import {useEffect, useState} from 'react';
import {useApplication} from "../../contexts/applicationContext/UseApplication.jsx";
import {useDocument} from "../../contexts/documentContext/UseDocument.jsx";

export default function ApplicationManagement() {

    const {applications, getAllApplications, updateApplicationStatus} = useApplication();
    const {getDocument} = useDocument();
    const [selected, setSelected] = useState(null);


    //신청서 상태변경
    const handleAudit = async (applicationId, status) => {
        await updateApplicationStatus(applicationId, status);
    };

    const handleDocumentClick = async (documentId, documentName) => {
        await getDocument(documentId, documentName);
    };



    useEffect(() => {
        const run = async () => {
            await getAllApplications();};
        run();
    }, []);

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
                        {applications.map(app => (
                            <tr
                                key={app.applicationId}
                                style={{ ...styles.trRow, backgroundColor: selected?.applicationId === app.applicationId ? '#F0F7FF' : 'transparent' }}
                                onClick={() => setSelected(app)}
                            >
                                <td style={styles.td}><b>{app.username}</b></td>
                                <td style={styles.td}>{app.title}</td>
                                <td style={styles.td}>{app.createdAt}</td>
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
                        <p><b>신청자명:</b> {selected.username}</p>
                        <p><b>신청 사업:</b> {selected.title}</p>
                        <p>
                            <b>제출 서류:</b>{' '}
                            {selected?.documents && selected.documents.length > 0 ? (
                                selected.documents.map((doc, index) => (
                                    <React.Fragment key={doc.documentId || index}>
                                        <a
                                            href="#doc"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDocumentClick(doc.documentId, doc.originFilename); // 원하는 함수 실행 및 documentId 전달
                                            }}
                                        >
                                            {doc.originFilename}
                                        </a>
                                        {/* 서류가 여러 개일 경우 쉼표 구분자 추가 */}
                                        {index < selected.documents.length - 1 && ', '}
                                    </React.Fragment>
                                ))
                            ) : (
                                <span>제출된 서류가 없습니다.</span>
                            )}
                        </p>
                        <p><b>현재 상태:</b> {selected.status}</p>
                        <div style={styles.actionBtns}>
                            <button type="button" style={styles.approveBtn} onClick={(e) => {
                                e.stopPropagation();
                                handleAudit(selected.applicationId, "APPROVED")}}>승인 처리</button>
                            <button type="button" style={styles.rejectBtn} onClick={(e) => {
                                e.stopPropagation();
                                handleAudit(selected.applicationId, "REJECTED")}}>반려 처리</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const statusBadge = {
    'SUBMITTED': { color: '#E65100', fontWeight: 'bold' },
    'UNDER_REVIEW': { color: '#0D47A1', fontWeight: 'bold' },
    'APPROVED': { color: '#1B5E20', fontWeight: 'bold' },
    'REJECTED': { color: '#B71C1C', fontWeight: 'bold' },
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