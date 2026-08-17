import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import GrantManagement from './GrantManagement.jsx';
import ApplicationManagement from './ApplicationManagement.jsx';
import NoticeManagement from './NoticeManagement.jsx';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";
import LogManagement from "./LogManagement.jsx";
import Dashboard from "./Dashboard.jsx";

export default function AdminPage() {
    const { logout } = useAuth();
    // 'dashboard' | 'program' | 'audit' | 'board' | 'log'
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* ------------------- 1. 상단 관리자 헤더 ------------------- */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoArea}>
                        <Link to="/" style={styles.logoLink}>
                            <span style={styles.logoBadge}>GOV</span>
                            <span style={styles.logoText}>지원금24</span>
                            <span style={styles.adminBadge}>ADMIN</span>
                        </Link>
                    </div>
                    <div style={styles.topNav}>
                        <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <span style={styles.userInfo}>
                                관리자님
                            </span>
                        </Link>
                        <span style={styles.divider}>|</span>
                        <button style={styles.topLinkBtn} onClick={() => {
                            logout();
                            navigate('/');
                        }}>로그아웃</button>
                    </div>
                </div>
            </header>

            {/* ------------------- 2. 관리자 메인 레이아웃 ------------------- */}
            <div style={styles.bodyLayout}>
                {/* 좌측 사이드바 네비게이션 */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarHeader}>
                        <span style={styles.sidebarTitle}>관리 메뉴</span>
                    </div>
                    <div style={styles.sidebarMenu}>
                        <button
                            style={{
                                ...styles.menuItem,
                                ...(activeTab === 'dashboard' ? styles.menuItemActive : {})
                            }}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            대시보드
                        </button>
                        <button
                            style={{
                                ...styles.menuItem,
                                ...(activeTab === 'program' ? styles.menuItemActive : {})
                            }}
                            onClick={() => setActiveTab('program')}
                        >
                            지원 사업 관리
                        </button>
                        <button
                            style={{
                                ...styles.menuItem,
                                ...(activeTab === 'audit' ? styles.menuItemActive : {})
                            }}
                            onClick={() => setActiveTab('audit')}
                        >
                            신청자 심사 및 관리
                        </button>
                        <button
                            style={{
                                ...styles.menuItem,
                                ...(activeTab === 'board' ? styles.menuItemActive : {})
                            }}
                            onClick={() => setActiveTab('board')}
                        >
                            게시판 & 민원 관리
                        </button>
                        <button
                            style={{
                                ...styles.menuItem,
                                ...(activeTab === 'log' ? styles.menuItemActive : {})
                            }}
                            onClick={() => setActiveTab('log')}
                        >
                            시스템 로그 관리
                        </button>
                    </div>
                </aside>

                {/* 중앙 메인 콘텐츠 영역 */}
                <main style={styles.mainContent}>
                    <div style={styles.contentInner}>
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'program' && <GrantManagement />}
                        {activeTab === 'audit' && <ApplicationManagement />}
                        {activeTab === 'board' && <NoticeManagement />}
                        {activeTab === 'log' && <LogManagement />}
                    </div>
                </main>
            </div>
        </div>
    );
}

// 지원금24 메인페이지 및 대시보드 공통 통합 스타일 시스템
const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#333',
        width: '100%',
        boxSizing: 'border-box',
    },
    // 헤더 영역
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
    logoArea: {
        display: 'flex',
        alignItems: 'center',
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
    },
    logoBadge: {
        backgroundColor: '#0056b3',
        color: '#ffffff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#111111',
    },
    adminBadge: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#0056b3',
        backgroundColor: '#eef6ff',
        padding: '2px 8px',
        borderRadius: '4px',
        marginLeft: '4px',
    },
    topNav: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    userInfo: {
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#111111',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    icon: {
        fontSize: '13px',
    },
    divider: {
        color: '#dee2e6',
    },
    topLinkBtn: {
        background: 'none',
        border: 'none',
        color: '#495057',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        padding: 0,
    },
    // 바디 레이아웃 영역
    bodyLayout: {
        maxWidth: '1200px',
        width: '100%',
        margin: '24px auto',
        padding: '0 20px',
        display: 'flex',
        gap: '24px',
        boxSizing: 'border-box',
    },
    // 사이드바
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
    sidebarMenu: {
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
    // 메인 콘텐츠
    mainContent: {
        flex: 1,
        minWidth: 0, // Flex 자식 요소 넘침 방지
    },
    contentInner: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '30px 24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        minHeight: '500px',
        boxSizing: 'border-box',
    },
};