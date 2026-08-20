import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";

/*
    로그인 관리
    1. useAuth를 통한 로그인 함수 실행
    2. loginType을 통한 로그인 방식 변환
    3. errorMessage를 통한 에러 메시지 출력(로그인 실패)
*/

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState('id');

    // 폼 입력 상태
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    // 로그인 실패 에러 메시지 상태
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage(''); // 입력 시 에러 메시지 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            console.error('로그인 에러:', error);
            setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
            setFormData((prev) => ({ ...prev, password: '' }));
        }
    };

    return (
        <div style={styles.container}>
            {/* 최상단 헤더 영역 */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoArea}>
                        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={styles.logoBadge}>GOV</span>
                            <span style={styles.logoText}>지원금24</span>
                        </Link>
                    </div>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={styles.homeBtn}>
                            메인으로 돌아가기 ➔
                        </button>
                    </Link>
                </div>
            </header>

            {/* 로그인 메인 컨테이너 */}
            <main style={styles.mainContent}>
                <div style={styles.authCard}>
                    <div style={styles.titleHeader}>
                        <h2 style={styles.title}>로그인</h2>
                    </div>
                    <p style={styles.subtitle}>
                        안전하고 편리한 지원금24 서비스 이용을 위해 로그인해주세요.
                    </p>

                    {/* 로그인 방식 선택 탭 */}
                    <div style={styles.tabContainer}>
                        <button
                            type="button"
                            style={{
                                ...styles.tabButton,
                                ...(loginType === 'id' ? styles.activeTab : {}),
                            }}
                            onClick={() => {
                                setLoginType('id');
                                setErrorMessage('');
                            }}
                        >
                            아이디 로그인
                        </button>
                        <button
                            type="button"
                            style={{
                                ...styles.tabButton,
                                ...(loginType === 'easy' ? styles.activeTab : {}),
                            }}
                            onClick={() => {
                                setLoginType('easy');
                                setErrorMessage('');
                            }}
                        >
                            간편인증 (민간인증서)
                        </button>
                    </div>

                    {loginType === 'id' ? (
                        /* 아이디 로그인 폼 */
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label} htmlFor="username">
                                    아이디
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="아이디를 입력하세요"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label} htmlFor="password">
                                    비밀번호
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            {/* 로그인 에러 메시지 표시 영역 */}
                            {errorMessage && (
                                <div style={styles.errorText}>
                                    {errorMessage}
                                </div>
                            )}

                            <div style={styles.utilityRow}>
                                <label style={styles.checkboxLabel}>
                                    <input type="checkbox" style={{ marginRight: '6px', cursor: 'pointer' }} />
                                    아이디 저장
                                </label>
                                <div style={styles.findLinks}>
                                    <span style={styles.findLink} onClick={() => alert('아이디 찾기 기능 준비중입니다.')}>아이디 찾기</span>
                                    <span style={styles.linkDivider}>|</span>
                                    <span style={styles.findLink} onClick={() => alert('비밀번호 찾기 기능 준비중입니다.')}>비밀번호 찾기</span>
                                </div>
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                로그인
                            </button>
                        </form>
                    ) : (
                        /* 간편인증 영역 (안내용) */
                        <div style={styles.easyAuthBox}>
                            <p style={styles.easyAuthText}>
                                카카오, 네이버, 패스(PASS) 등의 간편인증서를 사용하여 안전하게 로그인할 수 있습니다.
                            </p>
                            <button
                                type="button"
                                style={styles.submitBtn}
                                onClick={() => alert('간편인증 모듈 호출')}
                            >
                                간편인증서로 로그인
                            </button>
                        </div>
                    )}

                    {/* 하단 회원가입 유도 영역 */}
                    <div style={styles.bottomPrompt}>
                        <span>아직 지원금24 회원이 아니신가요?</span>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            <button style={styles.registerLinkBtn}>
                                회원가입하기
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* 스타일 정의 (가로 정렬 표기) */
const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#111111' },
    header: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
    headerInner: { maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoArea: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
    logoBadge: { backgroundColor: '#0056b3', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' },
    logoText: { fontSize: '22px', fontWeight: 'bold', color: '#111111' },
    homeBtn: { background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    mainContent: { padding: '40px 20px 60px', display: 'flex', justifyContent: 'center' },
    authCard: { backgroundColor: '#ffffff', width: '100%', maxWidth: '460px', padding: '36px 32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
    titleHeader: { borderBottom: '2px solid #111111', paddingBottom: '10px', marginBottom: '12px', textAlign: 'center' },
    title: { fontSize: '22px', fontWeight: 'bold', color: '#111111', margin: 0 },
    subtitle: { fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 24px 0', lineHeight: '1.5' },
    tabContainer: { display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' },
    tabButton: { flex: 1, padding: '12px 0', border: 'none', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 'bold', color: '#666666', cursor: 'pointer', borderBottom: '2px solid transparent', marginBottom: '-1px', transition: 'all 0.15s ease' },
    activeTab: { color: '#0056b3', borderBottom: '2px solid #0056b3' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#111111' },
    input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', width: '100%', color: '#111111' },
    errorText: { fontSize: '13px', color: '#d93025', fontWeight: '500', marginTop: '-4px' },
    utilityRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666666', marginTop: '4px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
    findLinks: { display: 'flex', gap: '8px' },
    findLink: { cursor: 'pointer', color: '#666666' },
    linkDivider: { color: '#cbd5e1' },
    submitBtn: { backgroundColor: '#0056b3', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', width: '100%', transition: 'background-color 0.15s ease' },
    easyAuthBox: { textAlign: 'center', padding: '24px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0' },
    easyAuthText: { margin: '0 0 16px 0', fontSize: '14px', color: '#333333', lineHeight: '1.5' },
    bottomPrompt: { marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666' },
    registerLinkBtn: { background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', padding: 0 },
};