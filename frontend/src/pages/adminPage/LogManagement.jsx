import  { useState } from "react";

function LogManagement() {
    const [search, setSearch] = useState("");

    const logs = [
        {
            user: "김철수",
            requestId: "REQ-20260728-001",
            requestTime: "2026-07-28 09:12:31",
            url: "/api/subsidy/apply"
        },
        {
            user: "이영희",
            requestId: "REQ-20260729-002",
            requestTime: "2026-07-29 10:24:17",
            url: "/api/user/profile"
        },
        {
            user: "박민수",
            requestId: "REQ-20260730-003",
            requestTime: "2026-07-30 11:03:42",
            url: "/api/subsidy/list"
        },
        {
            user: "김철수",
            requestId: "REQ-20260730-004",
            requestTime: "2026-07-30 13:18:09",
            url: "/api/inquiry/create"
        },
        {
            user: "정수진",
            requestId: "REQ-20260730-005",
            requestTime: "2026-07-30 14:42:51",
            url: "/api/notice/list"
        }
    ];

    const filteredLogs = logs.filter((log) =>
        log.user.includes(search) ||
        log.requestId.includes(search) ||
        log.requestTime.includes(search) ||
        log.url.includes(search)
    );

    return (
        <>
            <style>{`
                .log-management {
                    background: #ffffff;
                    border-radius: 15px;
                    padding: 30px;
                    width: 100%;
                    box-sizing: border-box;
                }

                .log-management h1 {
                    margin: 0 0 25px;
                    font-size: 28px;
                    font-weight: 700;
                    color: #111111;
                }

                /* 검색 영역 */

                .log-search {
                    display: flex;
                    width: 100%;
                    margin-bottom: 25px;
                }

                .log-search input {
                    flex: 1;
                    height: 48px;
                    padding: 0 15px;
                    border: 1px solid #d9dfe8;
                    border-radius: 7px 0 0 7px;
                    font-size: 15px;
                    outline: none;
                    box-sizing: border-box;
                }

                .log-search input:focus {
                    border-color: #0066cc;
                }

                .log-search button {
                    width: 80px;
                    height: 48px;
                    border: none;
                    border-radius: 0 7px 7px 0;
                    background-color: #0066cc;
                    color: white;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .log-search button:hover {
                    background-color: #0055aa;
                }

                /* 로그 테이블 */

                .log-list {
                    width: 100%;
                }

                .log-header {
                    display: grid;
                    grid-template-columns: 15% 25% 25% 35%;
                    min-height: 50px;
                    align-items: center;

                    border-top: 2px solid #0066cc;
                    border-bottom: 1px solid #dfe4eb;

                    background-color: #f8fafc;

                    color: #8c99aa;
                    font-size: 16px;
                    font-weight: 700;
                }

                .log-header div,
                .log-row div {
                    padding: 0 14px;
                }

                .log-row {
                    display: grid;
                    grid-template-columns: 15% 25% 25% 35%;
                    min-height: 58px;
                    align-items: center;

                    border-bottom: 1px solid #e1e6ed;

                    color: #8c99aa;
                    font-size: 15px;
                }

                .log-row:hover {
                    background-color: #fafcff;
                }

                .log-row div:last-child {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .no-log {
                    height: 100px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-bottom: 1px solid #e1e6ed;

                    color: #999999;
                }
            `}</style>

            <div className="log-management">

                <h1>로그 관리</h1>

                {/* 검색창 */}
                <div className="log-search">
                    <input
                        type="text"
                        placeholder="사용자, 요청 ID, URL 등을 검색하세요"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button type="button">
                        검색
                    </button>
                </div>

                {/* 로그 목록 */}
                <div className="log-list">

                    {/* 테이블 헤더 */}
                    <div className="log-header">
                        <div>사용자</div>
                        <div>요청 ID</div>
                        <div>요청 시간</div>
                        <div>URL</div>
                    </div>

                    {/* 로그 데이터 */}
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                            <div
                                className="log-row"
                                key={log.requestId}
                            >
                                <div>{log.user}</div>
                                <div>{log.requestId}</div>
                                <div>{log.requestTime}</div>
                                <div>{log.url}</div>
                            </div>
                        ))
                    ) : (
                        <div className="no-log">
                            검색 결과가 없습니다.
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default LogManagement;