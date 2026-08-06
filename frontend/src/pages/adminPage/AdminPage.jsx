import { useState } from 'react';
import {Link} from 'react-router-dom';
import GrantManagement from './GrantManagement.jsx';
import ApplicationManagement from './ApplicationManagement.jsx';
import Dashboard from './Dashboard.jsx';
import {useAuth} from "../../contexts/authContext/UseAuth.jsx";

export default function AdminPage() {
    const {logout} = useAuth();
    const [activeTab, setActiveTab] = useState('program'); // 'program' | 'audit' | 'board'

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoArea}>
                        <Link to="/"><span style={styles.logoBadge}>GOV</span>
                        <span style={styles.logoText}> 지원금24<span style={styles.adminText}> ADMIN</span></span></Link>
                    </div>
                    <div style={styles.topNav}>
                        <span style={styles.userInfo}>👤 관리자님</span>
                        <Link to="/"><button style={styles.topLinkBtn} onClick={() => {logout()}}>로그아웃</button></Link>
                    </div>
                </div>
            </header>

            {/* 대시보드 메인 레이아웃 */}
            <div style={styles.bodyLayout}>
                {/* 좌측 사이드바 */}
                <aside style={styles.sidebar}>
                    <div style={styles.sidebarMenu}>
                        <button
                            style={{ ...styles.menuItem, ...(activeTab === 'program' ? styles.menuItemActive : {}) }}
                            onClick={() => setActiveTab('program')}
                        >
                            📋 지원 사업 관리
                        </button>
                        <button
                            style={{ ...styles.menuItem, ...(activeTab === 'audit' ? styles.menuItemActive : {}) }}
                            onClick={() => setActiveTab('audit')}
                        >
                            🔎 신청자 심사 및 관리
                        </button>
                        <button
                            style={{ ...styles.menuItem, ...(activeTab === 'board' ? styles.menuItemActive : {}) }}
                            onClick={() => setActiveTab('board')}
                        >
                            📢 게시판 & 민원 관리
                        </button>
                    </div>
                </aside>

                {/* 중앙 메인 콘텐츠 영역 */}
                <main style={styles.mainContent}>
                    {activeTab === 'program' && <GrantManagement />}
                    {activeTab === 'audit' && <ApplicationManagement />}
                    {activeTab === 'board' && <Dashboard />}
                </main>
            </div>
        </div>
    );
}

const styles = {
    container: { backgroundColor: '#F4F6F9', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif" },
    header: { backgroundColor: '#FFFFFF', borderBottom: '2px solid #0056B3', padding: '12px 0' },
    headerInner: { maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoArea: { display: 'flex', alignItems: 'center', gap: '8px' },
    logoBadge: { backgroundColor: '#0056b3', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px',},
    logoText: { fontSize: '17px', fontWeight: 'bold', color: '#111',},
    adminText: { fontSize: '17px', fontWeight: 'bold', color: '#0056b3',},
    topNav: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#555' },
    topLinkBtn: {background: 'none', border: 'none', color: '#495057', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',},
    bodyLayout: { maxWidth: '1280px', margin: '24px auto', padding: '0 24px', display: 'flex', gap: '24px' },
    sidebar: { width: '240px', backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: 'fit-content' },
    sidebarMenu: { display: 'flex', flexDirection: 'column', gap: '8px' },
    menuItem: { textAlign: 'left', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', fontSize: '15px', fontWeight: '500', color: '#444', cursor: 'pointer', transition: 'all 0.2s' },
    menuItemActive: { backgroundColor: '#EBF3FC', color: '#0056B3', fontWeight: 'bold' },
    mainContent: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }
};