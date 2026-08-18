import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";

/*
    회원가입 관리
    1. useAuth을 통한 회원가입 함수 등록
    3. formData 기준 비밀번호 체크
    2. agreed를 통한 약관 동의 상태 체크
*/

const RegisterPage = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        email: '',
    });

    // 약관 동의 상태
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            alert('필수 이용약관에 동의해주세요.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const submitData = { ...formData };
            delete submitData.confirmPassword;
            await signUp(submitData);

            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
            setFormData((prev) => ({ ...prev, username: '', password: '', confirmPassword: '' }));
        }
    };

    return (
        <div style={styles.container}>
            {/* 최상단 헤더 */}
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

            {/* 회원가입 메인 컨테이너 */}
            <main style={styles.mainContent}>
                <div style={styles.authCard}>
                    <div style={styles.titleHeader}>
                        <h2 style={styles.title}>회원가입</h2>
                    </div>
                    <p style={styles.subtitle}>
                        지원금24 서비스 이용을 위해 기본 정보를 입력해 주세요.
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* 아이디 중복확인 포함 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="username">
                                아이디 <span style={styles.required}>*</span>
                            </label>
                            <div style={styles.inputWithBtn}>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="아이디 입력"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    style={{ ...styles.input, flex: 1 }}
                                />
                                <button
                                    type="button"
                                    style={styles.subBtn}
                                    onClick={() => alert('아이디 중복확인 기능 준비중입니다.')}
                                >
                                    중복확인
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="password">
                                비밀번호 <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="비밀번호 (8자 이상)"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        {/* 비밀번호 확인 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="confirmPassword">
                                비밀번호 확인 <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="비밀번호 재입력"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        {/* 이름 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="name">
                                이름 <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="성함 입력"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        {/* 휴대전화 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="phone">
                                휴대전화번호 <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="'-' 없이 숫자만 입력 (예: 01012345678)"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        {/* 이메일 */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label} htmlFor="email">
                                이메일주소 <span style={styles.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="example@domain.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>

                        {/* 약관 동의 */}
                        <div style={styles.termsBox}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    style={{ marginRight: '8px', cursor: 'pointer' }}
                                />
                                [필수] 개인정보 수집 및 이용에 동의합니다.
                            </label>
                        </div>

                        <button type="submit" style={styles.submitBtn}>
                            회원가입 완료
                        </button>
                    </form>

                    {/* 하단 로그인 유도 영역 */}
                    <div style={styles.bottomPrompt}>
                        <span>이미 계정이 있으신가요?</span>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            <button style={styles.loginLinkBtn}>
                                로그인하기
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#111111' },
    header: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' },
    headerInner: { maxWidth: '1200px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoArea: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
    logoBadge: { backgroundColor: '#0056b3', color: '#ffffff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' },
    logoText: { fontSize: '22px', fontWeight: 'bold', color: '#111111' },
    homeBtn: { background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    mainContent: { padding: '40px 20px 60px', display: 'flex', justifyContent: 'center' },
    authCard: { backgroundColor: '#ffffff', width: '100%', maxWidth: '520px', padding: '36px 32px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
    titleHeader: { borderBottom: '2px solid #111111', paddingBottom: '10px', marginBottom: '12px', textAlign: 'center' },
    title: { fontSize: '22px', fontWeight: 'bold', color: '#111111', margin: 0 },
    subtitle: { fontSize: '14px', color: '#666666', textAlign: 'center', margin: '0 0 24px 0', lineHeight: '1.5' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#111111' },
    required: { color: '#d93025' },
    input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', width: '100%', color: '#111111' },
    inputWithBtn: { display: 'flex', gap: '8px' },
    subBtn: { backgroundColor: '#475569', color: '#ffffff', border: 'none', padding: '0 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background-color 0.15s ease' },
    termsBox: { backgroundColor: '#f8f9fa', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '4px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '13px', color: '#333333', cursor: 'pointer', fontWeight: '500' },
    submitBtn: { backgroundColor: '#0056b3', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', width: '100%', transition: 'background-color 0.15s ease' },
    bottomPrompt: { marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666666' },
    loginLinkBtn: { background: 'none', border: 'none', color: '#0056b3', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline', padding: 0 },
};

export default RegisterPage;