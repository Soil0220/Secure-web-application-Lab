import { useState, useEffect } from 'react';
import {useLoading} from "../contexts/loadingContext/UseLoading.jsx";
import {useNotice} from "../contexts/noticeContext/useNotice.jsx";

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const {loading} = useLoading(true);
    const {getNotices} = useNotice();
    const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항 (상세보기용)


    useEffect(() => {
        const run = async () => {
            const response = await getNotices();
            setNotices(response.data);
        }
        run();
    }, []);

    if(loading){
        return null;
    }

    // 날짜 포맷 함수 (YYYY-MM-DD)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p style={{ textAlign: 'center', padding: '40px' }}>공지사항을 불러오는 중입니다...</p>
            ) : notices.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>등록된 공지사항이 없습니다.</p>
            ) : (
                <div>
                    <ul style={styles.list}>
                        {notices.map(n => (
                                <li
                                    key={n.id}
                                    style={styles.listItem}
                                    onClick={() => setSelectedNotice(n)}
                                >
                                    {n.isPinned ? (<span><b style={{ color: '#E54D42' }}>[공지]</b> {n.title}</span>
                                    ) : (
                                        <span>{n.title}</span>
                                    )}
                                    <span style={styles.date}>{formatDate(n.updatedAt)}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {/* 공지사항 상세 모달 (클릭 시 팝업) */}
            {selectedNotice && (
                <div style={styles.modalOverlay} onClick={() => setSelectedNotice(null)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalHeader}>
                            <div>
                                {selectedNotice.isPinned && <span style={styles.badge}>[공지]</span>}
                                <h3 style={{ display: 'inline', fontSize: '1.25rem' }}>{selectedNotice.title}</h3>
                            </div>
                            <span style={styles.modalDate}>{formatDate(selectedNotice.updatedAt)}</span>
                        </div>
                        <hr style={{ margin: '16px 0', border: '0', borderTop: '1px solid #eee' }} />

                        {/* 공지사항 본문 내용 (줄바꿈 보존) */}
                        <div style={styles.modalBody}>
                            {selectedNotice.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// CSS-in-JS 스타일
const styles = {
    container: {width: '100%', margin: '0', padding: '6px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', fontFamily: 'sans-serif'},
    title: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#111' },
    list: { listStyle: 'none', padding: 0, margin: 0 },
    listItem: { padding: '12px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' },
    date: { fontSize: '13px', color: '#888' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    theadRow: { backgroundColor: '#f7fafc', borderBottom: '2px solid #edf2f7' },
    th: { padding: '12px 16px', fontSize: '0.9rem', color: '#4a5568', fontWeight: 'bold', textAlign: 'center' },
    tr: { borderBottom: '1px solid #edf2f7', cursor: 'pointer', transition: 'background-color 0.2s' },
    pinnedRow: { borderBottom: '1px solid #edf2f7', backgroundColor: '#fffaf0', cursor: 'pointer', fontWeight: 'bold' },
    tdCenter: { padding: '14px 16px', textAlign: 'center', fontSize: '0.95rem', color: '#718096' },
    tdTitle: { padding: '14px 16px', fontSize: '0.95rem', color: '#2d3748' },
    badge: { display: 'inline-block', backgroundColor: '#e53e3e', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', marginRight: '8px', fontWeight: 'bold' },
    /* 모달 스타일 */
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '600px', borderRadius: '8px', padding: '24px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalDate: { fontSize: '0.85rem', color: '#a0aec0' },
    modalBody: { minHeight: '150px', maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#2d3748', fontSize: '0.95rem' },
    closeBtn: { padding: '8px 16px', backgroundColor: '#4a5568', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
};

export default NoticeList;