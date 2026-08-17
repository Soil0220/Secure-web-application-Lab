import { useEffect, useState } from "react";
import { useInquiry } from "../../contexts/inquiryContext/UseInquiry.jsx";

export default function Dashboard() {

    const { inquiries, getAllInquiries } = useInquiry();

    // 기본 요약 통계
    const [baseStats] = useState({
        totalPrograms: 12,       // 운영 중인 지원사업 수
        totalApplicants: 148,    // 총 사업 신청자 수
        todayApplicants: 9,      // 오늘 신규 신청자 수
    });

    // 최근 접수된 지원사업 신청 내역 (샘플 데이터)
    const [recentApplications] = useState([
        {
            id: 101,
            category: "청년 / 주거",
            programTitle: "2026 청년 월세 특별지원금",
            applicantName: "김철수",
            appliedAt: "2026.08.17 11:30",
            status: "SIMSA",
        },
        {
            id: 102,
            category: "창업 / 소상공인",
            programTitle: "초기 창업 패키지 지원사업",
            applicantName: "이영희",
            appliedAt: "2026.08.17 09:15",
            status: "APPROVED",
        },
        {
            id: 103,
            category: "중장년 / 재취업",
            programTitle: "중장년 디지털 재교육 지원금",
            applicantName: "박민수",
            appliedAt: "2026.08.16 16:45",
            status: "SIMSA",
        },
    ]);

    // Derived State: inquiries가 배열이거나 { data: [...] } 객체일 경우 모두 안전하게 처리
    const inquiryArray = Array.isArray(inquiries)
        ? inquiries
        : (inquiries?.data && Array.isArray(inquiries.data) ? inquiries.data : []);

    const pendingInquiriesCount = inquiryArray.filter(
        (q) => q && q.status !== "ANSWERED"
    ).length;

    const pendingInquiryList = inquiryArray.filter(
        (q) => q && q.status !== "ANSWERED"
    ).slice(0, 3);

    useEffect(() => {
        const fetchData = async () => {
            if (typeof getAllInquiries === "function") {
                await getAllInquiries();
            }
        };
        fetchData();
    }, []); // 👈 의존성 배열을 빈 배열([])로 고정하여 최초 1회만 호출되도록 수정

    return (
        <>
            <style>{`
                .admin-dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                    width: 100%;
                    box-sizing: border-box;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .header-badge {
                    font-size: 11px;
                    font-weight: 800;
                    color: #2563eb;
                    letter-spacing: 0.05em;
                }

                .content-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 4px 0 0 0;
                    letter-spacing: -0.02em;
                }

                .today-date {
                    font-size: 13px;
                    color: #64748b;
                    font-weight: 500;
                }

                /* 요약 그리드 */
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }

                .stat-card {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .stat-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #64748b;
                }

                .stat-value {
                    font-size: 28px;
                    font-weight: 800;
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }

                .stat-value.blue { color: #2563eb; }
                .stat-value.amber { color: #d97706; }
                .stat-value.green { color: #16a34a; }
                .stat-value.cyan { color: #0891b2; }

                .unit-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                }

                /* 메인 컨텐츠 2열 그리드 */
                .main-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                @media (max-width: 900px) {
                    .main-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .section-card {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                }

                .sub-text {
                    font-size: 12px;
                    color: #94a3b8;
                }

                .card-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .data-card, .qna-card {
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 18px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.01);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .category-text {
                    font-size: 12px;
                    font-weight: 700;
                    color: #2563eb;
                }

                .inquiry-no {
                    font-size: 11px;
                    font-weight: 600;
                    color: #94a3b8;
                    letter-spacing: 0.05em;
                }

                .status-badge {
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .status-badge.simsa {
                    background-color: #eff6ff;
                    color: #2563eb;
                }

                .status-badge.approved {
                    background-color: #f0fdf4;
                    color: #16a34a;
                }

                .status-badge.pending {
                    background-color: #fff7ed;
                    color: #c2410c;
                }

                .item-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 2px 0;
                }

                .item-content {
                    font-size: 13px;
                    color: #475569;
                    margin: 4px 0 8px 0;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .meta-row {
                    font-size: 12px;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .meta-row .divider {
                    color: #cbd5e1;
                }

                .empty-card {
                    padding: 32px;
                    text-align: center;
                    background-color: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .empty-text {
                    font-size: 13px;
                    color: #94a3b8;
                    margin: 0;
                }
            `}</style>

            <div className="admin-dashboard">
                {/* 상단 타이틀 */}
                <div className="dashboard-header">
                    <div>
                        <span className="header-badge">ADMIN SYSTEM</span>
                        <h2 className="content-title">관리자 대시보드</h2>
                    </div>
                    <span className="today-date">오늘: 2026.08.17</span>
                </div>

                {/* 요약 카드 */}
                <div className="summary-grid">
                    <div className="stat-card">
                        <span className="stat-label">운영 중인 지원사업</span>
                        <div className="stat-value blue">
                            {baseStats.totalPrograms}
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

                    <div className="stat-card">
                        <span className="stat-label">총 사업 신청자 수</span>
                        <div className="stat-value green">
                            {baseStats.totalApplicants}
                            <span className="unit-text">명</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <span className="stat-label">오늘 신규 신청자</span>
                        <div className="stat-value cyan">
                            +{baseStats.todayApplicants}
                            <span className="unit-text">명</span>
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
                            {recentApplications.map((app) => (
                                <div key={app.id} className="data-card">
                                    <div className="card-header">
                                        <span className="category-text">{app.category}</span>
                                        <span
                                            className={`status-badge ${
                                                app.status === "SIMSA" ? "simsa" : "approved"
                                            }`}
                                        >
                                            {app.status === "SIMSA" ? "심사중" : "승인완료"}
                                        </span>
                                    </div>
                                    <h4 className="item-title">{app.programTitle}</h4>
                                    <div className="meta-row">
                                        <span>신청자: <strong>{app.applicantName}</strong></span>
                                        <span className="divider">|</span>
                                        <span>신청일시: {app.appliedAt}</span>
                                    </div>
                                </div>
                            ))}
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
                                                NO.{String(inq.inquiryId || idx + 1).padStart(5, "0")}
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
            </div>
        </>
    );
}