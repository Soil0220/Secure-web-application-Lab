import { useEffect, useState } from "react";
// 프로젝트 경로에 맞게 컨텍스트 import 경로를 수정해 주세요.
import { useApplication } from "../../contexts/applicationContext/UseApplication.jsx";
import { useInquiry } from "../../contexts/inquiryContext/UseInquiry.jsx";

/*
    유저 대시보드
    1. useApplication을 이용한 지원금 제도 신청 조회 함수 등록
    2. useInquiry를 이용한 문의 조회 함수 등록
    3. 지원금 신청 상태에 대한 Map과 날짜 포맷 변경 함수 정의
    3. 1분마다 currentTime 갱신, isWithin30Mins 함수를 통해 최신 요청 구분
    4. 신청 진행중 | 지급완료 | 총 신청 | 답변 대기 문의 | 건수에 대한 통계 계산
    5. 최신순 기준 최근 신청내역 5개, 답변 대기 민원 3개 출력
*/

export default function Dashboard() {
    const { applications, getApplications } = useApplication();
    const { inquiries, getInquiries } = useInquiry();

    // 30분 이내 신청 여부를 판별하기 위한 현재 시간 상태
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchDashboardData = async () => {
            await getApplications();
            await getInquiries();
        };
        fetchDashboardData();

        // 1분마다 현재 시간 갱신
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const appList = applications;
    const inqList = inquiries;

    // 대시보드 요약 통계 계산
    const inProgressCount = appList.filter(app => ["SUBMITTED", "UNDER_REVIEW"].includes(app.status)).length;
    const paidCount = appList.filter(app => app.status === "PAID").length;
    const totalAppCount = appList.length;
    const pendingInquiryList = inqList.filter(inq => inq && inq.status !== "ANSWERED");
    const pendingInquiryCount = pendingInquiryList.length;

    // 최근 신청 내역 가공 (최신순 정렬 후 상위 5개 표시)
    const recentApplications = [...appList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // 답변 대기 민원 상위 3개 추출
    const recentPendingInquiries = pendingInquiryList.slice(0, 3);

    // 30분 이내 판별 함수
    const isWithin30Mins = (dateString) => {
        const diffMs = currentTime.getTime() - new Date(dateString).getTime();
        return diffMs >= 0 && diffMs <= 30 * 60 * 1000;
    };

    // 상태값에 따른 UI(텍스트, 클래스명) 매핑 헬퍼 함수
    const getStatusInfo = (status) => {
        switch (status) {
            case "SUBMITTED": return { text: "접수됨", className: "submitted" };
            case "UNDER_REVIEW": return { text: "심사중", className: "submitted" };
            case "APPROVED": return { text: "승인", className: "approved" };
            case "PAID": return { text: "지급완료", className: "approved" };
            case "REJECTED": return { text: "반려", className: "rejected" };
            default: return { text: status || "알 수 없음", className: "submitted" };
        }
    };

    // 날짜 포맷 변환 (YYYY.MM.DD HH:mm)
    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div className="admin-dashboard">
            {/* 상단 타이틀 */}
            <div className="dashboard-header">
                <div>
                    <span className="header-badge">USER DASHBOARD</span>
                    <h2 className="content-title">마이페이지 대시보드</h2>
                </div>
                <span className="today-date">
                    오늘: {currentTime.getFullYear()}.{String(currentTime.getMonth() + 1).padStart(2, '0')}.{String(currentTime.getDate()).padStart(2, '0')}
                </span>
            </div>

            {/* 신청 요약 카드 */}
            <div className="summary-grid four-cols">
                <div className="stat-card">
                    <span className="stat-label">신청 진행 중</span>
                    <div className="stat-value blue">
                        {inProgressCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">지급 완료</span>
                    <div className="stat-value green">
                        {paidCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">총 신청 건수</span>
                    <div className="stat-value dark">
                        {totalAppCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">답변 대기 문의</span>
                    <div className="stat-value amber">
                        {pendingInquiryCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>
            </div>

            {/* 본문 레이아웃 */}
            <div className="main-grid">
                {/* 좌측: 최근 신청 내역 */}
                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">최근 신청 내역</h3>
                        <span className="sub-text">실시간 지원금 신청 현황</span>
                    </div>

                    <div className="card-list">
                        {recentApplications.length > 0 ? (
                            recentApplications.map((app) => {
                                const statusInfo = getStatusInfo(app.status);
                                const isNew = isWithin30Mins(app.createdAt);

                                return (
                                    <div key={app.applicationId} className="data-card">
                                        <div className="card-header">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span className="category-text">지원금 신청</span>
                                                {isNew && <span className="new-badge">NEW</span>}
                                            </div>
                                            <span className={`status-badge ${statusInfo.className}`}>
                                                {statusInfo.text}
                                            </span>
                                        </div>
                                        <h4 className="item-title">{app.title}</h4>
                                        <div className="meta-row">
                                            <span>신청자: <strong>{app.username}</strong></span>
                                            <span className="divider">|</span>
                                            <span>신청일시: {formatDate(app.createdAt)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="empty-card">
                                <p className="empty-text">최근 신청한 내역이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 우측: 답변 대기 민원 목록 */}
                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">답변 대기 민원 목록</h3>
                        <span className="sub-text">답변을 기다리는 내 문의</span>
                    </div>

                    <div className="card-list">
                        {recentPendingInquiries.length > 0 ? (
                            recentPendingInquiries.map((inq) => (
                                <div key={inq.inquiryId} className="qna-card">
                                    <div className="card-header">
                                        <span className="inquiry-no">
                                            NO.{String(inq.inquiryId).padStart(5, "0")}
                                        </span>
                                        <span className="status-badge pending">답변대기</span>
                                    </div>
                                    <h4 className="item-title">{inq.title}</h4>
                                    <p className="item-content">{inq.content || "내용이 없습니다."}</p>
                                    <div className="meta-row">
                                        <span>작성자: <strong>{inq.username || "사용자"}</strong></span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-card">
                                <p className="empty-text">답변이 필요한 민원이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 스타일 정의 */}
            <style>{dashboardStyles}</style>
        </div>
    );
}


const dashboardStyles = `
    .admin-dashboard { display: flex; flex-direction: column; gap: 28px; width: 100%; box-sizing: border-box; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; }
    .header-badge { font-size: 11px; font-weight: 800; color: #2563eb; letter-spacing: 0.05em; }
    .content-title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 0 0; letter-spacing: -0.02em; }
    .today-date { font-size: 13px; color: #64748b; font-weight: 500; }
    
    .summary-grid.four-cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1024px) { .summary-grid.four-cols { grid-template-columns: repeat(2, 1fr); } }
    
    .stat-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; }
    .stat-label { font-size: 13px; font-weight: 600; color: #64748b; }
    .stat-value { font-size: 28px; font-weight: 800; display: flex; align-items: baseline; gap: 4px; }
    .stat-value.blue { color: #2563eb; } 
    .stat-value.amber { color: #d97706; } 
    .stat-value.green { color: #16a34a; } 
    .stat-value.cyan { color: #0891b2; }
    .stat-value.dark { color: #0f172a; }
    
    .unit-text { font-size: 16px; font-weight: 700; color: #0f172a; }
    .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }
    
    .section-card { display: flex; flex-direction: column; gap: 16px; }
    .section-header { display: flex; justify-content: space-between; align-items: baseline; }
    .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
    .sub-text { font-size: 12px; color: #94a3b8; }
    
    .card-list { display: flex; flex-direction: column; gap: 12px; }
    .data-card, .qna-card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.01); }
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .category-text { font-size: 12px; font-weight: 700; color: #2563eb; }
    .inquiry-no { font-size: 11px; font-weight: 600; color: #94a3b8; letter-spacing: 0.05em; }
    
    .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .status-badge.submitted { background-color: #eff6ff; color: #2563eb; }
    .status-badge.approved { background-color: #f0fdf4; color: #16a34a; }
    .status-badge.rejected { background-color: #fef2f2; color: #dc2626; }
    .status-badge.pending { background-color: #fff7ed; color: #c2410c; }
    
    .new-badge { font-size: 10px; font-weight: 800; background-color: #ef4444; color: #ffffff; padding: 2px 6px; border-radius: 4px; margin-left: 8px; animation: pulse 2s infinite; }
    .item-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 2px 0; }
    .item-content { font-size: 13px; color: #475569; margin: 4px 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .meta-row { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 8px; }
    .meta-row .divider { color: #cbd5e1; }
    
    .empty-card { padding: 32px; text-align: center; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .empty-text { font-size: 13px; color: #94a3b8; margin: 0; }
    
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
`;