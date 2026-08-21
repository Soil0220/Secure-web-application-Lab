import { useState, useEffect } from 'react';
import { useAuth } from "../contexts/authContext/UseAuth.jsx";
import {useNavigate} from "react-router-dom";

const MAX_INTERVAL_MS = 15 * 60 * 1000; // 10분

export const SessionTimer = () => {
    const { session, extendSession, logout } = useAuth();
    const navigate = useNavigate();

    // 남은 시간 계산 로직
    const calculateRemainingTime = (lastExtendedTime) => {
        if (!lastExtendedTime || typeof lastExtendedTime !== 'number') return null;

        const nowMs = Date.now();
        const expireTimeMs = lastExtendedTime + MAX_INTERVAL_MS;
        const diffMs = expireTimeMs - nowMs;

        return Math.max(0, Math.floor(diffMs / 1000));
    };

    // <SessionTimer key={session?.lastExtendedTime} /> 형태 전달시 key 값이 바뀔 때마다 컴포넌트가 재생성되므로, 여기서 항상 최신 남은 시간이 초기화
    const [remainingSeconds, setRemainingSeconds] = useState(() =>
        calculateRemainingTime(session?.lastExtendedTime)
    );

    // mm:ss 형식으로 변환
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
            return '--:--';
        }
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // 실시간 타이머 동작
    useEffect(() => {
        const lastTime = session?.lastExtendedTime;
        if (!lastTime || typeof lastTime !== 'number') return;

        const timer = setInterval(() => {
            const currentRemaining = calculateRemainingTime(lastTime);

            if (currentRemaining !== null) {
                setRemainingSeconds(currentRemaining);

                if (currentRemaining <= 0) {
                    clearInterval(timer);
                    logout();
                    //메인 페이지로 이동하면서 세션만료 상태 전달
                    navigate('/', { state: { sessionExpired: true }, replace: true });
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session?.lastExtendedTime]);

    return (
        <div style={timerStyles.container}>
            <span style={timerStyles.label}>
                ⏱ 자동 로그아웃
                <strong style={timerStyles.time}>{formatTime(remainingSeconds)}</strong>
            </span>
            <button
                onClick={extendSession}
                style={timerStyles.extendBtn}
                title="시간 연장하기"
            >
                연장
            </button>
        </div>
    );
};

const timerStyles = {
    container: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '4px 12px', borderRadius: '20px', height: '26px', boxSizing: 'border-box' },
    label: { fontSize: '12px', color: '#495057', display: 'flex', alignItems: 'center', gap: '6px' },
    time: { color: '#0056b3', fontWeight: 'bold', minWidth: '34px', textAlign: 'center', letterSpacing: '0.5px' },
    extendBtn: { backgroundColor: '#ffffff', border: '1px solid #ced4da', color: '#495057', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};