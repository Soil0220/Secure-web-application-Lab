import { useState } from 'react';
import {useNavigate, Link} from 'react-router-dom'
import {useAuth} from "../../contexts/authContext/UseAuth.jsx";

const LoginPage = () => {

    const {login} = useAuth();

    const navigate = useNavigate();

    // 로그인 방식 탭 (아이디 로그인 / 간편인증)
    const [loginType, setLoginType] = useState('id');

    // 폼 입력 상태 (스프링부트 로그인 API 전달용)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            console.error('로그인에러:', error);
            setFormData((prev) => ({ ...prev, password: '' }));
        }


    };

    return (
        <div style={styles.container}>
            {/* 최상단 헤더 영역 */}
            <header style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.logoArea}>
                        <Link to="/"><span style={styles.logoBadge}>GOV</span>
                            <span style={styles.logoText}> 지원금24</span></Link>
                    </div>
                    <Link to="/"><button style={styles.homeBtn}>
                        메인으로 돌아가기 ➔
                    </button></Link>
                </div>
            </header>

            {/* 로그인 메인 컨테이너 */}
            <main style={styles.mainContent}>
                <div style={styles.authCard}>
                    <h2 style={styles.title}>로그인</h2>
                    <p style={styles.subtitle}>
                        안전하고 편리한 지원금24 서비스 이용을 위해 로그인해주세요.
                    </p>

                    {/* 로그인 방식 선택 탭 */}
                    <div style={styles.tabContainer}>
                        <button
                            style={{
                                ...styles.tabButton,
                                ...(loginType === 'id' ? styles.activeTab : {}),
                            }}
                            onClick={() => setLoginType('id')}
                        >
                            아이디 로그인
                        </button>
                        <button
                            style={{
                                ...styles.tabButton,
                                ...(loginType === 'easy' ? styles.activeTab : {}),
                            }}
                            onClick={() => setLoginType('easy')}
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

                            <div style={styles.utilityRow}>
                                <label style={styles.checkboxLabel}>
                                    <input type="checkbox" style={{ marginRight: '6px' }} />
                                    아이디 저장
                                </label>
                                <div style={styles.findLinks}>
                                    <span style={styles.findLink} onClick={() => alert('아이디 찾기')}>아이디 찾기</span>
                                    <span style={styles.linkDivider}>|</span>
                                    <span style={styles.findLink} onClick={() => alert('비밀번호 찾기')}>비밀번호 찾기</span>
                                </div>
                            </div>

                            <button type="submit" style={styles.submitBtn}>
                                로그인
                            </button>
                        </form>
                    ) : (
                        /* 간편인증 영역 (안내용) */
                        <div style={styles.easyAuthBox}>
                            <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#333' }}>
                                카카오, 네이버, 패스(PASS) 등의 간편인증서를 사용하여 로그인할 수 있습니다.
                            </p>
                            <button
                                style={{ ...styles.submitBtn, backgroundColor: '#3b82f6' }}
                                onClick={() => alert('간편인증 모듈 호출')}
                            >
                                간편인증서로 로그인
                            </button>
                        </div>
                    )}

                    {/* 하단 회원가입 유도 영역 */}
                    <div style={styles.bottomPrompt}>
                        <span>아직 지원금24 회원이 아니신가요?</span>
                        <Link to="/register"><button style={styles.registerLinkBtn}>
                            회원가입하기
                        </button></Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

/* 스타일 정의 (공통 디자인 반영) */
const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#333',
    },
    header: {
        backgroundColor: '#fff',
        borderBottom: '1px solid #e9ecef',
    },
    headerInner: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    logoBadge: {
        backgroundColor: '#0056b3',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    logoText: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#111111',
    },
    homeBtn: {
        background: 'none',
        border: 'none',
        color: '#0056b3',
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
    },
    mainContent: {
        padding: '50px 20px',
        display: 'flex',
        justifyContent: 'center',
    },
    authCard: {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '460px',
        padding: '40px 32px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
    },
    title: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#111111',
        margin: '0 0 8px 0',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        textAlign: 'center',
        margin: '0 0 28px 0',
        lineHeight: '1.4',
    },
    tabContainer: {
        display: 'flex',
        marginBottom: '24px',
        borderBottom: '2px solid #e2e8f0',
    },
    tabButton: {
        flex: 1,
        padding: '12px 0',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#718096',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        marginBottom: '-2px',
    },
    activeTab: {
        color: '#0056b3',
        borderBottom: '3px solid #0056b3',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#111111',
    },
    input: {
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0',
        fontSize: '15px',
        outline: 'none',
    },
    utilityRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '13px',
        color: '#4a5568',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    findLinks: {
        display: 'flex',
        gap: '8px',
    },
    findLink: {
        cursor: 'pointer',
        color: '#4a5568',
    },
    linkDivider: {
        color: '#cbd5e0',
    },
    submitBtn: {
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        padding: '14px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
    },
    easyAuthBox: {
        textAlign: 'center',
        padding: '20px 10px',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        border: '1px dashed #cbd5e0',
    },
    bottomPrompt: {
        marginTop: '28px',
        paddingTop: '20px',
        borderTop: '1px solid #edf2f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#4a5568',
    },
    registerLinkBtn: {
        background: 'none',
        border: 'none',
        color: '#0056b3',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '14px',
        textDecoration: 'underline',
    },
};

export default LoginPage;