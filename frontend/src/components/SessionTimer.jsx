import { useState, useEffect } from 'react';
import {useAuth} from "../contexts/authContext/UseAuth.jsx";

export const SessionTimer = () => {
    const {session, extendSession} = useAuth();

    //남은 시간 계산 정의
    const calculateRemainingTime = (lastExtendedTime, maxIntervalMs) => {
        const nowMs = Date.now();
        const expireTimeMs = lastExtendedTime + maxIntervalMs;
        const diffMs = expireTimeMs - nowMs;
        const remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
        return remainingSeconds;
    };

    //사용시 <SessionTimer key={session?.lastExtendedTime} /> 형태로 사용해서 컴포넌트 자체를 재생성시켜 매번 최신값으로 초기값 할당
    const [remainingSeconds, setRemainingSeconds] = useState(() =>
        calculateRemainingTime(session?.lastExtendedTime)
    );

    //백엔드와 동일하게 맞춰야함
    const maxIntervalMs = 10 * 60 * 1000;

    // mm:ss 형식으로 변환
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }



    // 1초마다 남은 시간 줄여주는 실시간 타이머(세션 획득, 연장시 동작)
    useEffect(() => {
        if (!session?.lastExtendedTime) return;

        //1초마다 타이머실행
        const timer = setInterval(() => {

            const currentRemaining = calculateRemainingTime(session.lastExtendedTime, maxIntervalMs);
            setRemainingSeconds(currentRemaining);

            if (currentRemaining <= 0) {
                clearInterval(timer);
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [session?.lastExtendedTime]);


    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', width: '220px' }}>
            <div>
                <span>남은 세션 시간: </span>
                <strong>{formatTime(remainingSeconds)}</strong>
            </div>
            <button
                onClick={extendSession}
                style={{ marginTop: '8px', padding: '4px 8px', cursor: 'pointer' }}
            >
                연장하기
            </button>
        </div>
    );
};