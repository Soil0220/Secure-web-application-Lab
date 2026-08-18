import { useEffect, useState } from "react";
import { useInquiry } from "../../contexts/inquiryContext/UseInquiry.jsx";
import { useGrant } from "../../contexts/grantContext/UseGrant.jsx";
import { useApplication } from "../../contexts/applicationContext/UseApplication.jsx";


/*
    어드민 대시보드
    1. userInquiry를 통한 모든 문의 조회
    2. useGrant를 통한 모든 지원금제도 조회
    3. useApplication을 통한 모든 지원신 제도 신청 조회
    4. currentTime을 통해 1분단위로 시간 업데이트
    5. isWithin30Mins을 통해 요청시간이 30분 이내인지 검증 후 isNew 활성 및 UI변경
    6. 모집중인 지원사업수, 총 사업수, 미답변 개수, 오늘 신규신청수 계산후 출력
    7. 대시보드에 가장 최근 신청내역 5개와 미답변 3개까지 표시
    8. ApplicationStatus Enum에 대한 매퍼와 시간 포맷 정의
*/

export default function Dashboard() {
    // Context 데이터 불러오기
    const { inquiries, getAllInquiries } = useInquiry();
    const { grants, getGrants } = useGrant();
    const { applications, getAllApplications } = useApplication();

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            await getAllInquiries();
            await getGrants();
            await getAllApplications();
        };

        fetchData();

        // 1분마다 현재 시간 업데이트
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // 데이터 안전하게 배열로 변환
    const inquiryList = inquiries;
    const grantList = grants;
    const appList = applications;

    // 요약 통계 계산
    const activeGrantsCount = grantList.filter(g => g.status === "RECRUITING").length;
    const pendingInquiriesCount = inquiryList.filter(q => q && q.status !== "ANSWERED").length;
    const totalApplicantsCount = appList.length;

    // 오늘 신규 신청자 계산
    const todayApplicantsCount = appList.filter(app => {
        const appDate = new Date(app.createdAt);
        return appDate.toDateString() === currentTime.toDateString();
    }).length;

    // 목록 데이터 가공
    // 신청 내역: 최신순 정렬 후 상위 5개
    const recentApplications = [...appList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    // 답변 대기 민원: 상위 3개
    const pendingInquiryList = inquiryList.filter(q => q && q.status !== "ANSWERED").slice(0, 3);

    // 유틸 함수: 30분 이내 여부 판별
    const isWithin30Mins = (dateString) => {
        const diffMs = currentTime.getTime() - new Date(dateString).getTime();
        return diffMs >= 0 && diffMs <= 30 * 60 * 1000;
    };

    // 백엔드 ApplicationStatus Enum 고려한 상태값 한글 변환 맵퍼
    const getStatusInfo = (status) => {
        switch(status) {
            case "SUBMITTED": return { text: "접수됨", className: "submitted" };
            case "UNDER_REVIEW": return { text: "심사중", className: "review" };
            case "APPROVED": return { text: "승인", className: "approved" };
            case "REJECTED": return { text: "반려", className: "rejected" };
            case "PAID": return { text: "지급완료", className: "paid" };
            default: return { text: status || "알 수 없음", className: "submitted" };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hour}:${minute}`;
    };

    return (
        <div className="admin-dashboard">
            {/* 상단 타이틀 */}
            <div className="dashboard-header">
                <div>
                    <span className="header-badge">ADMIN SYSTEM</span>
                    <h2 className="content-title">관리자 대시보드</h2>
                </div>
                <span className="today-date">
                    오늘: {currentTime.getFullYear()}.{String(currentTime.getMonth() + 1).padStart(2, '0')}.{String(currentTime.getDate()).padStart(2, '0')}
                </span>
            </div>

            {/* 요약 카드 */}
            <div className="summary-grid">
                <div className="stat-card">
                    <span className="stat-label">운영 중인 지원사업</span>
                    <div className="stat-value blue">
                        {activeGrantsCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">총 사업 신청</span>
                    <div className="stat-value green">
                        {totalApplicantsCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">오늘 신규 신청</span>
                    <div className="stat-value cyan">
                        +{todayApplicantsCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">답변 대기 민원</span>
                    <div className="stat-value amber">
                        {pendingInquiriesCount}
                        <span className="unit-text">건</span>
                    </div>
                </div>
            </div>

            {/* 본문 2열 */}
            <div className="main-grid">
                {/* 좌측: 최근 신청 내역 */}
                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">최근 접수된 신청 내역</h3>
                        <span className="sub-text">실시간 신청 현황</span>
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
                                                <span className="category-text">지원사업 신청</span>
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
                                <p className="empty-text">접수된 신청 내역이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 우측: 답변 대기 민원 */}
                <div className="section-card">
                    <div className="section-header">
                        <h3 className="section-title">답변 대기 민원 목록</h3>
                        <span className="sub-text">빠른 처리가 필요한 문의</span>
                    </div>

                    <div className="card-list">
                        {pendingInquiryList.length > 0 ? (
                            pendingInquiryList.map((inq, idx) => (
                                <div key={inq.inquiryId || idx} className="qna-card">
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

            {/* 스타일 태그를 최하단에 배치 */}
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
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .stat-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; display: flex; flex-direction: column; gap: 8px; }
    .stat-label { font-size: 13px; font-weight: 600; color: #64748b; }
    .stat-value { font-size: 28px; font-weight: 800; display: flex; align-items: baseline; gap: 4px; }
    .stat-value.blue { color: #2563eb; } .stat-value.amber { color: #d97706; } .stat-value.green { color: #16a34a; } .stat-value.cyan { color: #0891b2; }
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
    
    /* ApplicationStatus Badge Colors */
    .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .status-badge.submitted { background-color: #eff6ff; color: #2563eb; } /* 접수됨 */
    .status-badge.review { background-color: #fef3c7; color: #d97706; }    /* 심사중 */
    .status-badge.approved { background-color: #f0fdf4; color: #16a34a; }  /* 승인 */
    .status-badge.rejected { background-color: #fef2f2; color: #dc2626; }  /* 반려 */
    .status-badge.paid { background-color: #ecfdf5; color: #059669; }      /* 지급완료 */
    .status-badge.pending { background-color: #fff7ed; color: #c2410c; }   /* 답변대기 */

    .new-badge { font-size: 10px; font-weight: 800; background-color: #ef4444; color: #ffffff; padding: 2px 6px; border-radius: 4px; margin-left: 8px; animation: pulse 2s infinite; }
    .item-title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 2px 0; }
    .item-content { font-size: 13px; color: #475569; margin: 4px 0 8px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
    .meta-row { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 8px; }
    .meta-row .divider { color: #cbd5e1; }
    .empty-card { padding: 32px; text-align: center; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .empty-text { font-size: 13px; color: #94a3b8; margin: 0; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
`;