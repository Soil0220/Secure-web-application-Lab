import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GrantManagement from './GrantManagement.jsx';
import ApplicationManagement from './ApplicationManagement.jsx';
import NoticeManagement from './NoticeManagement.jsx';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";
import LogManagement from "./LogManagement.jsx";
import Dashboard from "./Dashboard.jsx";
import {SessionTimer} from "../../components/SessionTimer.jsx";


/*
    어드민 페이지
    1. 관리자 이름 클릭시 계정정보 페이지 이동
    2. 로그아웃 버튼 클릭시 로그아웃 요청 및 기본페이지 이동
    3. 선택된 탭에 따라 탭 UI 활성화 및 전환(전환시 메인에 관련 Management 페이지 출력)
*/


export default function AdminPage() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();
    // 'dashboard' | 'program' | 'audit' | 'board' | 'log'
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-container">
            {/*상단 관리자 헤더*/}
            <header className="admin-header">
                <div className="admin-header-inner">
                    <div className="admin-logo-area">
                        <Link to="/" className="admin-logo-link">
                            <span className="admin-logo-badge">GOV</span>
                            <span className="admin-logo-text">지원금24</span>
                            <span className="admin-badge">ADMIN</span>
                        </Link>
                    </div>
                    <div className="admin-top-nav">
                        {session && <SessionTimer key={session.lastExtendedTime} />}
                        <Link to="/account" className="admin-user-link">
                            <span className="admin-user-info">
                                관리자님
                            </span>
                        </Link>
                        <span className="admin-divider">|</span>
                        <button
                            className="admin-top-link-btn"
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/*관리자 메인 레이아웃*/}
            <div className="admin-body-layout">
                {/* 좌측 사이드바 네비게이션 */}
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <span className="admin-sidebar-title">관리 메뉴</span>
                    </div>
                    <div className="admin-sidebar-menu">
                        <button
                            className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            대시보드
                        </button>
                        <button
                            className={`admin-menu-item ${activeTab === 'program' ? 'active' : ''}`}
                            onClick={() => setActiveTab('program')}
                        >
                            지원 사업 관리
                        </button>
                        <button
                            className={`admin-menu-item ${activeTab === 'audit' ? 'active' : ''}`}
                            onClick={() => setActiveTab('audit')}
                        >
                            신청자 심사 및 관리
                        </button>
                        <button
                            className={`admin-menu-item ${activeTab === 'board' ? 'active' : ''}`}
                            onClick={() => setActiveTab('board')}
                        >
                            게시판 & 민원 관리
                        </button>
                        <button
                            className={`admin-menu-item ${activeTab === 'log' ? 'active' : ''}`}
                            onClick={() => setActiveTab('log')}
                        >
                            시스템 로그 관리
                        </button>
                    </div>
                </aside>

                {/* 중앙 메인 콘텐츠 영역 */}
                <main className="admin-main-content">
                    <div className="admin-content-inner">
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'program' && <GrantManagement />}
                        {activeTab === 'audit' && <ApplicationManagement />}
                        {activeTab === 'board' && <NoticeManagement />}
                        {activeTab === 'log' && <LogManagement />}
                    </div>
                </main>
            </div>

            {/* 스타일 태그를 최하단에 배치 */}
            <style>{adminStyles}</style>
        </div>
    );
}


const adminStyles = `
    .admin-container { font-family: 'Noto Sans KR', sans-serif; background-color: #f8f9fa; min-height: 100vh; color: #333; width: 100%; box-sizing: border-box; }
    
    /* Header Styles */
    .admin-header { background-color: #ffffff; border-bottom: 2px solid #0056b3; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02); width: 100%; }
    .admin-header-inner { max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; min-height: 70px; box-sizing: border-box; }
    .admin-logo-area { display: flex; align-items: center; }
    .admin-logo-link { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .admin-logo-badge { background-color: #0056b3; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px; }
    .admin-logo-text { font-size: 22px; font-weight: bold; color: #111111; }
    .admin-badge { font-size: 14px; font-weight: bold; color: #0056b3; background-color: #eef6ff; padding: 2px 8px; border-radius: 4px; margin-left: 4px; }
    
    .admin-top-nav { display: flex; align-items: center; gap: 12px; }
    .admin-user-link { text-decoration: none; color: inherit; }
    .admin-user-info { font-size: 13px; font-weight: bold; color: #111111; display: flex; align-items: center; gap: 4px; }
    .admin-divider { color: #dee2e6; }
    .admin-top-link-btn { background: none; border: none; color: #495057; cursor: pointer; font-size: 13px; font-weight: 500; padding: 0; }

    /* Layout Styles */
    .admin-body-layout { max-width: 1200px; width: 100%; margin: 24px auto; padding: 0 20px; display: flex; gap: 24px; box-sizing: border-box; }
    
    /* Sidebar Styles */
    .admin-sidebar { width: 240px; background-color: #ffffff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03); height: fit-content; box-sizing: border-box; flex-shrink: 0; }
    .admin-sidebar-header { padding-bottom: 12px; margin-bottom: 12px; border-bottom: 2px solid #111111; }
    .admin-sidebar-title { font-size: 16px; font-weight: bold; color: #111111; }
    .admin-sidebar-menu { display: flex; flex-direction: column; gap: 6px; }
    
    .admin-menu-item { text-align: left; padding: 12px 16px; border-radius: 8px; border: none; background-color: transparent; font-size: 15px; font-weight: 500; color: #495057; cursor: pointer; transition: all 0.2s ease; width: 100%; box-sizing: border-box; }
    .admin-menu-item.active { background-color: #eef6ff; color: #0056b3; font-weight: bold; border-left: 4px solid #0056b3; border-radius: 4px 8px 8px 4px; }

    /* Main Content Styles */
    .admin-main-content { flex: 1; min-width: 0; }
    .admin-content-inner { background-color: #ffffff; border-radius: 12px; padding: 30px 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03); min-height: 500px; box-sizing: border-box; }
`;