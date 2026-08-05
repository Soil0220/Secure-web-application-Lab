import {useState, useEffect} from 'react';
import {useAuth} from "../../contexts/authContext/UseAuth.jsx";
import {useLoading} from "../../contexts/loadingContext/UseLoading.jsx";
import NoticeList from "../../components/NoticeList.jsx";
import {Link} from 'react-router-dom';

const MainPage = () => {

    const {session, setSession, checkSession, logout} = useAuth();
    const {loading, setLoading} = useLoading();

    // 2. 현재 선택된 메인 메뉴 탭 상태
    const [activeTab, setActiveTab] = useState('지원금종류');

    // 메뉴 클릭 핸들러
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {

        const run = async () => {
            setLoading(true);
            const response = await checkSession();
            if(response.success){
                setSession(response.data);
            } else{
                setSession(null);
            }
            setLoading(false);
        };

        run();
    }, []);

    if(loading){
        return null;
    }


    return (
        <div style={styles.container}>
            {/* ------------------- 1. 최상단 유틸리티 헤더 (로그인/회원가입/마이페이지) ------------------- */}
            <header style={styles.topHeader}>
                <div style={styles.topHeaderInner}>
                    <div style={styles.authMenu}>
                        {session ? (
                            <>
                                {session.role === 'ADMIN' ? (
                                    <>
                                        <Link to="/admin"><button style={styles.topLinkBtn}>
                                        <span style={styles.icon}>👤</span> 관리자페이지
                                        </button></Link>
                                    </>) : (
                                    <>
                                        <Link to="/user"><button style={styles.topLinkBtn}>
                                        <span style={styles.icon}>👤</span> 마이페이지
                                        </button></Link>
                                    </>)}

                                <span style={styles.divider}>|</span>
                                <button style={styles.topLinkBtn} onClick={() => {logout()}}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><button style={styles.topLinkBtn}>
                                    <span style={styles.icon}>🔓</span> 로그인
                                </button></Link>
                                <span style={styles.divider}>|</span>
                                <Link to="/register"><button style={styles.topLinkBtn}>
                                    <span style={styles.icon}>👤+</span> 회원가입
                                </button></Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ------------------- 2. 메인 로고 & 주요 4개 메뉴 네비게이션 ------------------- */}
            <nav style={styles.mainNav}>
                <div style={styles.navInner}>
                    {/* 로고 영역 */}
                    <div style={styles.logoArea} onClick={() => setActiveTab('지원금종류')}>
                        <span style={styles.logoBadge}>GOV</span>
                        <span style={styles.logoText}>지원금24</span>
                    </div>

                    {/* 4개 핵심 메뉴 */}
                    <ul style={styles.menuList}>
                        {['지원금종류', '지원금신청', '공지사항', '고객센터'].map((menu) => (
                            <li
                                key={menu}
                                style={{
                                    ...styles.menuItem,
                                    ...(activeTab === menu ? styles.activeMenuItem : {}),
                                }}
                                onClick={() => handleTabClick(menu)}
                            >
                                {menu}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* ------------------- 3. 하단 동적 콘텐츠 출력 영역 ------------------- */}
            <main style={styles.contentArea}>
                <div style={styles.contentInner}>
                    {activeTab === '지원금종류' && <TabSupportTypes />}
                    {activeTab === '지원금신청' && <TabSupportApply />}
                    {activeTab === '공지사항' && <TabNotice />}
                    {activeTab === '고객센터' && <TabCustomerCenter />}
                </div>
            </main>
        </div>
    );
};

//탭 정의

// 1. 지원금종류
const TabSupportTypes = () => (
    <div>
        <h2 style={styles.sectionTitle}>지금 많이 찾는 지원금 혜택</h2>
        <div style={styles.cardGrid}>
            <div style={styles.card}>
                <span style={styles.cardCategory}>청년 / 취업</span>
                <h3>청년월세 특별지원금</h3>
                <p>무주택 청년의 주거비 부담 경감을 위해 월세를 지원합니다.</p>
            </div>
            <div style={styles.card}>
                <span style={styles.cardCategory}>창업 / 소상공인</span>
                <h3>초기 창업 패키지 지원</h3>
                <p>유망 창업아이템을 보유한 초기창업기업의 사업화를 지원합니다.</p>
            </div>
            <div style={styles.card}>
                <span style={styles.cardCategory}>생활 / 복지</span>
                <h3>긴급 생활지원금</h3>
                <p>갑작스러운 위기상황으로 생계유지가 곤란한 가구를 지원합니다.</p>
            </div>
        </div>
    </div>
);

// 2. 지원금신청
const TabSupportApply = () => (
    <div>
        <h2 style={styles.sectionTitle}>지원금 원스톱 신청</h2>
        <div style={styles.infoBox}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>💡 신청 전 확인해주세요!</p>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                로그인 후 신청 시 기본 정보가 자동 입력되어 더 빠른 신청이 가능합니다.
            </p>
        </div>
        <div style={{ marginTop: '20px' }}>
            <button style={styles.primaryBtn} onClick={() => alert('신청 자격 조회')}>
                내게 맞는 지원금 조회 및 신청하기
            </button>
        </div>
    </div>
);

// 3. 공지사항
const TabNotice = () => (
    <div>
        <h2 style={styles.sectionTitle}>공지사항</h2>
        <NoticeList />
    </div>
);

// 4. 고객센터
const TabCustomerCenter = () => (
    <div>
        <h2 style={styles.sectionTitle}>고객센터</h2>
        <div style={styles.cardGrid}>
            <div style={styles.card}>
                <h3>자주 묻는 질문 (FAQ)</h3>
                <p>서비스 이용 관련 궁금증을 빠르게 해결하세요.</p>
            </div>
            <div style={styles.card}>
                <h3>1:1 문의하기</h3>
                <p>궁금한 점을 남겨주시면 담당자가 답변을 드립니다.</p>
            </div>
            <div style={styles.card}>
                <h3>보안센터 / 인증센터</h3>
                <p>인증서 등록 및 보안 프로그램 설치를 관리합니다.</p>
            </div>
        </div>
    </div>
);

//css

const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#333',
        width: '100%',
        boxSizing: 'border-box', //  전체 박스 사이즈 계산 통일
    },
    // 최상단 우측 로그인/회원가입 바
    topHeader: {
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#fff',
        fontSize: '13px',
        width: '100%',
    },
    topHeaderInner: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'flex-end',
        boxSizing: 'border-box', //  패딩이 전체 너비를 넘지 않도록 설정
    },
    authMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap', //  모바일 등 좁은 화면에서 줄바꿈 대응
    },
    topLinkBtn: {
        background: 'none',
        border: 'none',
        color: '#495057',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    divider: {
        color: '#dee2e6',
    },
    // 메인 네비게이션
    mainNav: {
        backgroundColor: '#fff',
        borderBottom: '2px solid #0056b3',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        width: '100%',
    },
    navInner: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '70px',
        boxSizing: 'border-box',
        flexWrap: 'wrap', //  화면 폭이 매우 좁을 때 로고와 메뉴 상하 분리 대응
        gap: '10px',
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
        color: '#111',
    },
    menuList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        height: '100%',
        flexWrap: 'wrap', //  메뉴가 화면 밖으로 넘치지 않고 유연하게 배치됨
    },
    menuItem: {
        padding: '12px 20px', //  세로 패딩 지정으로 높이 반응형 대응
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px', //  모바일 고려 살짝 조정
        fontWeight: 'bold',
        color: '#333',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        borderBottom: '3px solid transparent',
    },
    activeMenuItem: {
        color: '#0056b3',
        borderBottom: '3px solid #0056b3',
        backgroundColor: '#f1f5f9',
    },
    // 동적 콘텐츠 영역
    contentArea: {
        padding: '30px 20px',
        width: '100%',
        boxSizing: 'border-box',
    },
    contentInner: {
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '30px 24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        minHeight: '400px',
        boxSizing: 'border-box', //  패딩 포함 반응형 너비 계산
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: '20px',
        borderBottom: '2px solid #111111', //  글자색과 맞춰 밑줄도 진하게 매칭
        paddingBottom: '10px',
    },
    cardGrid: {
        display: 'grid',
        //  minmax를 250px로 내려서 소형 화면에서도 카드가 깨지지 않게 유연화
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        width: '100%',
    },
    card: {
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
    },
    cardCategory: {
        fontSize: '12px',
        color: '#0056b3',
        fontWeight: 'bold',
    },
    infoBox: {
        backgroundColor: '#eef6ff',
        borderLeft: '4px solid #0056b3',
        padding: '16px',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    primaryBtn: {
        backgroundColor: '#0056b3',
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '6px',
        cursor: 'pointer',
        maxWidth: '100%', //  버튼이 화면 너비를 넘지 않도록 제한
    },
    listGroup: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #edf2f7',
        fontSize: '15px',
        cursor: 'pointer',
        gap: '10px', //  제목과 날짜 사이 간격 보장
    },
    date: {
        color: '#a0aec0',
        fontSize: '13px',
        whiteSpace: 'nowrap', //  날짜 줄바꿈 방지
    },
};

export default MainPage;