import { useState } from 'react';

// 분리한 서브 컴포넌트 불러오기
import Dashboard from './Dashboard.jsx';
import ApplicationManagement from './ApplicationManagement.jsx';
import FavoriteManagement from './FavoriteManagement.jsx';
import DocumentManagement from './DocumentManagement.jsx';
import InquiryManagement from './InquiryManagement.jsx';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";

const UserPage = () => {
    // 현재 선택된 메뉴 탭 상태 (기본값: 대시보드)
    const [activeTab, setActiveTab] = useState('dashboard');
    const {session, logout } = useAuth();
    const navigate = useNavigate();

    // 신청 내역 데이터
    const applications = [
        {
            id: 1,
            category: '청년 / 취업',
            title: '청년월세 특별지원금',
            amount: '월 최대 20만원',
            period: '2026.01.01 ~ 2026.12.31',
            status: '심사중',
            statusColor: '#0056b3',
            statusBg: '#eef6ff',
            applyDate: '2026.03.10',
        },
        {
            id: 2,
            category: '창업 / 소상공인',
            title: '초기 창업 패키지 지원',
            amount: '최대 1억원',
            period: '2026.03.01 ~ 2026.04.15',
            status: '지급완료',
            statusColor: '#137333',
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
            tagColor: '#137333',
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
            statusColor: '#137333',
        },
        {
            id: 2,
            title: '지급 계좌 변경은 어떻게 하나요?',
            date: '2026.03.15',
            status: '접수중',
            statusBg: '#fef7e0',
            statusColor: '#b06000',
        },
    ];

    return (
        <div style={styles.pageBackground}>
            {/* 1. 상단 네비게이션 헤더 */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoGroup}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={styles.govBadge}>GOV</span>
                            <span style={styles.logoText}>지원금24</span>
                        </Link>
                    </div>
                    <div style={styles.userProfile}>
                        <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span style={styles.userName}>{session.name}님</span>
                        </Link>
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
                    <div style={styles.sidebarHeader}>
                        <span style={styles.sidebarTitle}>마이 메뉴</span>
                    </div>
                    <ul style={styles.menuList}>
                        <li>
                            <button
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === 'dashboard' ? styles.menuItemActive : {})
                                }}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                대시보드
                            </button>
                        </li>
                        <li>
                            <button
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === 'applications' ? styles.menuItemActive : {})
                                }}
                                onClick={() => setActiveTab('applications')}
                            >
                                지원금 신청 내역
                            </button>
                        </li>
                        <li>
                            <button
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === 'recommend' ? styles.menuItemActive : {})
                                }}
                                onClick={() => setActiveTab('recommend')}
                            >
                                맞춤 지원금 & 관심목록
                            </button>
                        </li>
                        <li>
                            <button
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === 'documents' ? styles.menuItemActive : {})
                                }}
                                onClick={() => setActiveTab('documents')}
                            >
                                자주 쓰는 서류
                            </button>
                        </li>
                        <li>
                            <button
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === 'inquiries' ? styles.menuItemActive : {})
                                }}
                                onClick={() => setActiveTab('inquiries')}
                            >
                                1:1 문의 내역
                            </button>
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

// 지원금24 브랜드 디자인 시스템 공통 스타일 정의
const styles = {
    pageBackground: {
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: "'Noto Sans KR', sans-serif",
        color: '#333',
        width: '100%',
        boxSizing: 'border-box',
    },
    header: {
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #0056b3',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        width: '100%',
    },
    headerInner: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '70px',
        boxSizing: 'border-box',
    },
    logoGroup: {
        display: 'flex',
        alignItems: 'center',
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
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#111111',
        marginLeft: '8px',
    },
    userProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
        fontWeight: '500',
        color: '#495057',
    },
    userName: {
        fontWeight: 'bold',
        color: '#111111',
    },
    logoutBtn: {
        border: 'none',
        background: 'none',
        color: '#495057',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        padding: 0,
    },
    mainContainer: {
        maxWidth: '1200px',
        width: '100%',
        margin: '24px auto',
        display: 'flex',
        gap: '24px',
        padding: '0 20px',
        boxSizing: 'border-box',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        height: 'fit-content',
        boxSizing: 'border-box',
        flexShrink: 0,
    },
    sidebarHeader: {
        paddingBottom: '12px',
        marginBottom: '12px',
        borderBottom: '2px solid #111111',
    },
    sidebarTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#111111',
    },
    menuList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    menuItem: {
        textAlign: 'left',
        padding: '12px 16px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '15px',
        fontWeight: '500',
        color: '#495057',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: '100%',
        boxSizing: 'border-box',
    },
    menuItemActive: {
        backgroundColor: '#eef6ff',
        color: '#0056b3',
        fontWeight: 'bold',
        borderLeft: '4px solid #0056b3',
        borderRadius: '4px 8px 8px 4px',
    },
    contentCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '30px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        minHeight: '500px',
        boxSizing: 'border-box',
    },
    titleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #111111',
        paddingBottom: '10px',
    },
    contentTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111111',
        margin: 0,
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: '16px',
        borderBottom: '2px solid #111111',
        paddingBottom: '8px',
    },
    summaryGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px',
    },
    summaryBox: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
    },
    summaryLabel: {
        fontSize: '13px',
        color: '#666666',
        marginBottom: '6px',
    },
    summaryValue: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#111111',
    },
    dataCard: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
        color: '#0056b3',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '4px 12px',
        borderRadius: '20px',
    },
    cardTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: '#111111',
        margin: '0 0 8px 0',
    },
    cardDetail: {
        fontSize: '13px',
        color: '#666666',
        margin: '4px 0',
    },
    primaryBtn: {
        backgroundColor: '#0056b3',
        color: '#ffffff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
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
        color: '#111111',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        maxWidth: '400px',
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        fontSize: '14px',
        color: '#111111',
        boxSizing: 'border-box',
        outline: 'none',
    },
    hr: {
        border: 'none',
        borderTop: '1px solid #e2e8f0',
        margin: '24px 0',
    },
};

export default UserPage;