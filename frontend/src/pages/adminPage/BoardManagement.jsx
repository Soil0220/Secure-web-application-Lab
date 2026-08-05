import { useState } from 'react';
import NoticeCreate from './NoticeCreate';
import NoticeList from "../../components/NoticeList.jsx";

export default function BoardManagement() {

    const [isOpen, setIsOpen] = useState(false);
    const [reload, setReload] = useState(0);
    const [tab, setTab] = useState('notice'); // 'notice' | 'qna'

    const [qnas, setQnas] = useState([
        { id: 1, user: '홍길동', title: '신청 서류 수정은 어떻게 하나요?', status: '답변대기', reply: '' },
        { id: 2, title: '지급 대상자 선정 기준 문의', user: '강감찬', status: '답변완료', reply: '선정 기준은 공지사항 15번 항목 참고 부탁드립니다.' }
    ]);

    const [selectedQna, setSelectedQna] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
        if (!replyText) return alert('답변을 입력해주세요.');
        setQnas(qnas.map(q => q.id === selectedQna.id ? { ...q, status: '답변완료', reply: replyText } : q));
        setSelectedQna(null);
        setReplyText('');
    };

    //공지글 종료후 콜백함수
    const handleClose = () => {
        setIsOpen(false);
        setReload(prev => prev + 1);
    };



    return (
        <div>
            <h2 style={styles.title}>📢 게시판 & 민원 관리</h2>

            {/* 탭 구분 */}
            <div style={styles.tabHeader}>
                <button style={{ ...styles.tabBtn, ...(tab === 'notice' ? styles.tabActive : {}) }} onClick={() => setTab('notice')}>공지사항 관리</button>
                <button style={{ ...styles.tabBtn, ...(tab === 'qna' ? styles.tabActive : {}) }} onClick={() => setTab('qna')}>1:1 민원 답변</button>
            </div>

            {/* 공지사항 탭 */}
            {tab === 'notice' && (
                <>
                    <div style={{ maxWidth: '900px', margin: '20px auto' }}>
                        {/* 상단 버튼 영역 (우측 정렬 및 아래쪽 여백 최소화) */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0px' }}>
                            <button style={styles.primaryBtn} onClick={() => setIsOpen(true)}>
                                + 공지사항 작성
                            </button>
                        </div>

                        {/* 공지사항 목록 */}
                        <NoticeList reload={reload} />
                    </div>
            {/*공지사항 생성 창*/}
                    {isOpen && (
                        <div style={styles.overlay} onClick={() => setIsOpen(false)}>
                            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <NoticeCreate onClose={handleClose} />
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* 1:1 민원 탭 */}
            {tab === 'qna' && (
                <div>
                    <ul style={styles.list}>
                        {qnas.map(q => (
                            <li key={q.id} style={styles.listItem} onClick={() => { setSelectedQna(q); setReplyText(q.reply); }}>
                                <span><b>[{q.user}]</b> {q.title}</span>
                                <span style={q.status === '답변완료' ? styles.statusDone : styles.statusWait}>{q.status}</span>
                            </li>
                        ))}
                    </ul>

                    {/* 민원 답변 모달 */}
                    {selectedQna && (
                        <div style={styles.modalOverlay}>
                            <div style={styles.modal}>
                                <h3>민원 답변 작성</h3>
                                <p><b>질문:</b> {selectedQna.title}</p>
                                <textarea
                                    style={styles.textarea}
                                    rows="4"
                                    value={replyText}
                                    onChange={e => setReplyText(e.target.value)}
                                    placeholder="답변 내용을 작성하세요..."
                                />
                                <div style={styles.modalBtns}>
                                    <button style={styles.primaryBtn} onClick={handleReplySubmit}>답변 등록</button>
                                    <button style={styles.cancelBtn} onClick={() => setSelectedQna(null)}>취소</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111' },
    tabHeader: { display: 'flex', gap: '10px', borderBottom: '2px solid #E2E8F0', marginBottom: '16px' },
    tabBtn: { padding: '8px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '15px', color: '#666' },
    tabActive: { color: '#0056B3', fontWeight: 'bold', borderBottom: '2px solid #0056B3' },
    primaryBtn: { backgroundColor: '#0056B3', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px' },
    cancelBtn: { backgroundColor: '#EEE', color: '#333', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: { padding: '12px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' },
    date: { fontSize: '13px', color: '#888' },
    statusWait: { color: '#D97706', fontWeight: 'bold', fontSize: '13px' },
    statusDone: { color: '#059669', fontWeight: 'bold', fontSize: '13px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    modal: { backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', width: '450px', display: 'flex', flexDirection: 'column', gap: '12px' },
    textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #CCC', fontFamily: 'inherit' },
    modalBtns: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' },
    overlay: {position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',zIndex: 9999,display: 'flex',justifyContent: 'center',alignItems: 'center',},
    modalContent: {position: 'relative', backgroundColor: '#ffffff', padding: '32px 28px', borderRadius: '12px', width: '90%', maxWidth: '520px',maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',border: '1px solid #e5e7eb',},
    closeXBtn: {position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '24px', color: '#9ca3af', cursor: 'pointer', lineHeight: '1',}
};