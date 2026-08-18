import { useEffect, useState } from 'react';
import { useLog } from "../../contexts/logContext/UseLog.jsx";


/*
    로그관리
    1. useLog를 통해 로그 조회 함수 등록
    2. 기존 로그 중 requestId || requestTime || apiUrl 중 검색내용(search)이 포함된 로그들 filteredLogs에 저장(소문자 기준 검사)
    3. filteredLogs 출력(search가 비어있으면 모든 로그 출력)
*/


export function LogManagement() {
    const [search, setSearch] = useState("");
    const { logs, getLogs } = useLog();

    const filteredLogs = logs ? logs.filter((log) =>
        (log.requestId && String(log.requestId).toLowerCase().includes(search.toLowerCase())) ||
        (log.requestTime && String(log.requestTime).includes(search)) ||
        (log.apiUrl && String(log.apiUrl).toLowerCase().includes(search.toLowerCase()))
    ) : [];

    useEffect(() => {
        const run = async () => {
            await getLogs();
        };
        run();
    }, []);

    return (
        <div className="log-management">
            {/* 상단 Header 영역 */}
            <div className="log-header-row">
                <div className="log-title-group">
                    <h1>로그 관리</h1>
                    <span className="log-count-badge">
                        총 <strong>{filteredLogs.length}</strong>건
                    </span>
                </div>

                <div className="log-search">
                    <input
                        type="text"
                        placeholder="요청 ID, 시간, API URL 검색..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="button">검색</button>
                </div>
            </div>

            {/* 로그 목록 */}
            <div className="log-list">
                <div className="log-grid log-header">
                    <div>요청 ID</div>
                    <div>요청 시간</div>
                    <div>API URL</div>
                </div>

                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                        <div
                            className="log-grid log-row"
                            key={log.requestId}
                        >
                            <div className="log-id" title={log.requestId}>
                                {log.requestId}
                            </div>
                            <div className="log-time">{log.requestTime}</div>
                            <div className="log-url" title={log.apiUrl}>
                                {log.apiUrl}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-log">검색 결과가 없습니다.</div>
                )}
            </div>

            <style>{`
                .log-management { font-family: "'Noto Sans KR', sans-serif"; display: flex; flex-direction: column; width: 100%; box-sizing: border-box; }

                /* Header 영역 */
                .log-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #111111; padding-bottom: 10px; gap: 16px; }
                .log-title-group { display: flex; align-items: baseline; gap: 12px; white-space: nowrap; }
                .log-management h1 { margin: 0; font-size: 20px; font-weight: bold; color: #111111; letter-spacing: -0.02em; }
                .log-count-badge { font-size: 14px; color: #666666; }
                .log-count-badge strong { color: #0056b3; }

                /* 검색 영역 */
                .log-search { display: flex; width: 320px; max-width: 100%; position: relative; }
                .log-search input { flex: 1; height: 44px; padding: 0 16px; border: 1px solid #cbd5e1; border-radius: 6px 0 0 6px; font-size: 14px; color: #111111; background-color: #ffffff; outline: none; box-sizing: border-box; transition: border-color 0.15s ease; }
                .log-search input:focus { border-color: #0056b3; }
                .log-search button { width: 90px; height: 44px; border: none; border-radius: 0 6px 6px 0; background-color: #0056b3; color: #ffffff; font-size: 14px; font-weight: bold; cursor: pointer; transition: background-color 0.15s ease; white-space: nowrap; }
                .log-search button:hover { background-color: #004494; }

                /* 로그 테이블 */
                .log-list { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03); }
                .log-grid { display: grid; grid-template-columns: 28% 22% 50%; align-items: center; }
                .log-header { min-height: 46px; background-color: #f8f9fa; border-bottom: 1px solid #e2e8f0; color: #333333; font-size: 13px; font-weight: bold; }
                .log-header div, .log-row div { padding: 0 16px; box-sizing: border-box; }
                .log-row { min-height: 48px; border-bottom: 1px solid #f1f5f9; color: #333333; font-size: 13px; transition: background-color 0.15s ease; }
                .log-row:last-child { border-bottom: none; }
                .log-row:hover { background-color: #f8f9fa; }

                /* 긴 데이터 속성 */
                .log-id { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; color: #0056b3; font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .log-time { font-size: 13px; color: #666666; }
                .log-url { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; color: #111111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .no-log { height: 120px; display: flex; align-items: center; justify-content: center; color: #666666; font-size: 14px; background-color: #ffffff; }
            `}</style>
        </div>
    );
}

export default LogManagement;