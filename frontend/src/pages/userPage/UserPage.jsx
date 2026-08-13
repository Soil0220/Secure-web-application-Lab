import { useState } from 'react';

// 분리한 서브 컴포넌트 불러오기
import Dashboard from './Dashboard.jsx';
import ApplicationManagement from './ApplicationManagement.jsx';
import FavoriteManagement from './FavoriteManagement.jsx';
import DocumentManagement from './DocumentManagement.jsx';
import InquiryManagement from './InquiryManagement.jsx';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/authContext/UseAuth.jsx";

const UserPage = () => {
    // 현재 선택된 메뉴 탭 상태 (기본값: 대시보드)
    const [activeTab, setActiveTab] = useState('dashboard');
    const {logout} = useAuth();
    const navigate = useNavigate();

    // 사용자 정보
    const userInfo = {
        name: '홍길동',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        bank: '국민은행',
        account: '123-456-789012',
    };

    // 신청 내역 데이터
    const applications = [
        {
            id: 1,
            category: '청년 / 취업',
            title: '청년월세 특별지원금',
            amount: '월 최대 20만원',
            period: '2026.01.01 ~ 2026.12.31',
            status: '심사중',
            statusColor: '#0066ff',
            statusBg: '#e6f0ff',
            applyDate: '2026.03.10',
        },
        {
            id: 2,
            category: '창업 / 소상공인',
            title: '초기 창업 패키지 지원',
            amount: '최대 1억원',
            period: '2026.03.01 ~ 2026.04.15',
            status: '지급완료',
            statusColor: '#10b981',
            statusBg: '#e6f4ea',
            applyDate: '2026.03.02',
        },
    ];

    // 맞춤 추천 지원금 데이터
    const recommendedGrants = [
        {
            id: 1,
            category: '생활 / 복지',
            title: '청년 문화예술패스 지원',
            amount: '연간 15만원',
            period: '2026.04.01 ~ 2026.05.31',
            tag: '모집중',
            tagBg: '#e6f4ea',
            tagColor: '#10b981',
        },
    ];

    // 1:1 문의 내역 데이터
    const inquiries = [
        {
            id: 1,
            title: '청년월세 서류 추가 제출 관련 문의',
            date: '2026.03.12',
            status: '답변완료',
            statusBg: '#e6f4ea',
            statusColor: '#10b981',
        },
        {
            id: 2,
            title: '지급 계좌 변경은 어떻게 하나요?',
            date: '2026.03.15',
            status: '접수중',
            statusBg: '#fef3c7',
            statusColor: '#d97706',
        },
    ];

    return (
        <div style={styles.pageBackground}>
            {/* 1. 상단 네비게이션 헤더 */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoGroup}>
                        <Link to="/"><span style={styles.govBadge}>GOV</span>
                        <span style={styles.logoText}>  지원금24</span></Link>
                    </div>
                    <div style={styles.userProfile}>
                        <Link to="/account"><span style={styles.userName}>{userInfo.name}님</span></Link>
                        <button style={styles.logoutBtn} onClick={() => {
                            logout();
                            navigate('/');
                        }}>로그아웃</button>
                    </div>
                </div>
            </header>

            {/* 2. 본문 컨테이너 */}
            <div style={styles.mainContainer}>
                {/* 좌측 사이드바 메뉴 */}
                <aside style={styles.sidebar}>
                    <ul style={styles.menuList}>
                        <li
                            style={activeTab === 'dashboard' ? styles.menuItemActive : styles.menuItem}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            대시보드
                        </li>
                        <li
                            style={activeTab === 'applications' ? styles.menuItemActive : styles.menuItem}
                            onClick={() => setActiveTab('applications')}
                        >
                            지원금 신청 내역
                        </li>
                        <li
                            style={activeTab === 'recommend' ? styles.menuItemActive : styles.menuItem}
                            onClick={() => setActiveTab('recommend')}
                        >
                            맞춤 지원금 & 관심목록
                        </li>
                        <li
                            style={activeTab === 'documents' ? styles.menuItemActive : styles.menuItem}
                            onClick={() => setActiveTab('documents')}
                        >
                            자주 쓰는 서류 / 증빙 제출
                        </li>
                        <li
                            style={activeTab === 'inquiries' ? styles.menuItemActive : styles.menuItem}
                            onClick={() => setActiveTab('inquiries')}
                        >
                            1:1 문의 내역
                        </li>
                    </ul>
                </aside>

                {/* 메인 콘텐츠 영역 (컴포넌트 스위칭) */}
                <main style={styles.contentCard}>
                    {activeTab === 'dashboard' && (
                        <Dashboard applications={applications} styles={styles} />
                    )}
                    {activeTab === 'applications' && (
                        <ApplicationManagement applications={applications} styles={styles} />
                    )}
                    {activeTab === 'recommend' && (
                        <FavoriteManagement recommendedGrants={recommendedGrants} styles={styles} />
                    )}
                    {activeTab === 'documents' && (
                        <DocumentManagement styles={styles} />
                    )}
                    {activeTab === 'inquiries' && (
                        <InquiryManagement inquiries={inquiries} styles={styles} />
                    )}
                </main>
            </div>
        </div>
    );
};

// 공통 스타일 정의
const styles = {
    pageBackground: {
        backgroundColor: '#f1f5f9',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
    },
    headerInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    govBadge: {
        backgroundColor: '#0056b3',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    logoText: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#111',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: '#334155',
    },
    userIcon: {
        fontSize: '16px',
    },
    userName: {
        fontWeight: 'bold',
    },
    logoutBtn: {
        border: 'none',
        background: 'none',
        color: '#64748b',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '8px',
    },
    mainContainer: {
        maxWidth: '1200px',
        margin: '24px auto',
        display: 'flex',
        gap: '24px',
        padding: '0 16px',
    },
    sidebar: {
        width: '240px',
        flexShrink: 0,
    },
    menuList: {
        listStyle: 'none',
        padding: '8px',
        margin: 0,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    menuItem: {
        padding: '12px 16px',
        margin: '4px 0',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#475569',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    menuItemActive: {
        padding: '12px 16px',
        margin: '4px 0',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#0066ff',
        backgroundColor: '#e6f0ff',
        cursor: 'pointer',
    },
    contentCard: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        minHeight: '500px',
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    contentTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#0f172a',
        margin: '0 0 20px 0',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '12px',
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    summaryBox: {
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        backgroundColor: '#f8fafc',
    },
    summaryLabel: {
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '6px',
    },
    summaryValue: {
        fontSize: '22px',
        fontWeight: 'bold',
    },
    dataCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '12px',
        backgroundColor: '#ffffff',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
    },
    categoryText: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#0066ff',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '4px 8px',
        borderRadius: '12px',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1e293b',
        margin: '0 0 8px 0',
    },
    cardDetail: {
        fontSize: '13px',
        color: '#64748b',
        margin: '4px 0',
    },
    primaryBtn: {
        backgroundColor: '#0066ff',
        color: '#ffffff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '12px',
    },
    formGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        maxWidth: '400px',
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    hr: {
        border: 'none',
        borderTop: '1px solid #e2e8f0',
        margin: '24px 0',
    },
};

export default UserPage;