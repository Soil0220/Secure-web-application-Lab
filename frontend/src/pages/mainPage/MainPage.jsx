import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";
import { useGrant } from "../../contexts/grantContext/UseGrant.jsx";
import { useFavorite } from "../../contexts/favoriteContext/UseFavorite.jsx";
import NoticeList from "../../components/NoticeList.jsx";
import ApplicationForm from "../../components/ApplicationForm.jsx";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {GRANT_CATEGORY_MAP, GRANT_CYCLE_MAP, GRANT_STATUS_MAP} from "../../constants/status.jsx";
import {SessionTimer} from "../../components/SessionTimer.jsx";

/*
    메인 페이지
    1. Grant Enum Map과 날짜 포맷팅 정의
    2. useAuth를 통한 세션 체크, 관리, 설정 등의 함수 등록
    3. loading을 통한 세션체크 중 랜더링 방지
    4. activeTab을 통한 지원금종류 | 지원금신청 | 공지사항 | 고객센터 탭 전환
    5. 세션과 세션역할 검사를 통한 UI변경(페이지, 즐겨찾기 등등)

    지원금 종류 탭
    1. useAuth를 통한 세션확인
    2. useGrant를 통한 지원금 제도조회 함수 등록
    3. useFavorite를 통한 즐겨찾기한 지원금 제도 조회 함수 등록
    4. scrollRef, mouseDown, startX, scrollLeft를 통한 마우스 드래그 이벤트
    4. isUser를 통해 User 계정 로그인시 메인페이지에서 즐겨찾기 기능 사용가능
    5. favoriteMap을 통해 유저계정이 즐겨찾기한 지원금 제도에 별표 생성
    6. 별 버튼 클릭을 통해 지원금 제도 즐겨찾기 토글함수 실행

    지원금 신청 탭
    1. isModalOpen을 통한 지원금 신청 모달 ON/OFF
    2. 신청하기 버튼 클릭시 지원금 신청 함수 실행

    공지사항 탭
    1. NoticeList 공용 컴포넌트를 이용한 공지사항 확인

*/


const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
};

const CATEGORY_CARDS = [
    {
        categoryKey: "YOUTH_EMPLOYMENT",
        category: "청년",
        title: "청년 지원 혜택",
        desc: "청년월세 특별지원, 자산 형성 지원금 등 청년층의 자립과 주거·일자리를 지원합니다."
    },
    {
        categoryKey: "BUSINESS_STARTUP",
        category: "창업",
        title: "창업 / 소상공인 혜택",
        desc: "초기 창업 패키지, 사업화 자금, 경영 안정 자금 등 유망 창업 기업과 소상공인을 지원합니다."
    },
    {
        categoryKey: "LIVING_WELFARE",
        category: "생활 / 복지",
        title: "생활 / 복지 혜택",
        desc: "긴급 생계지원금, 저소득층 자립 지원, 취약계층 맞춤형 바우처 등 생활 안정을 지원합니다."
    },
    {
        categoryKey: "HOUSING_FINANCE",
        category: "주거",
        title: "주거 금융 혜택",
        desc: "전월세 보증금 이자 지원, 주거급여, 공공임대주택 연계 등 주거비 부담을 경감해 드립니다."
    },
    {
        categoryKey: "HEALTH_CARE",
        category: "건강 / 의료",
        title: "건강 / 의료 혜택",
        desc: "고액 의료비 지원, 본인부담상한제, 정신건강 검진비 등 국민의 건강증진과 의료비를 지원합니다."
    }
];

export default function MainPage() {
    const { session, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // 현재 선택된 메인 메뉴 탭 상태
    const [activeTab, setActiveTab] = useState('지원금종류');

    // 메뉴 클릭 핸들러
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        // 세션 만료로 튕겨져 들어온 경우
        if (location.state?.sessionExpired) {
            alert("세션이 만료 되었습니다. 다시 로그인 해주세요.");
            // history state 초기화하여 새로고침 시 중복 alert 방지
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <div style={styles.container}>
            {/*최상단 유틸리티 헤더 (로그인/회원가입/마이페이지)*/}
            <header style={styles.topHeader}>
                <div style={styles.topHeaderInner}>
                    <div style={styles.authMenu}>
                        {session ? (
                            <>
                                <SessionTimer key={session?.lastExtendedTime} />
                                {session.sessionUser.role === 'ADMIN' ? (
                                    <Link to="/admin">
                                        <button style={styles.topLinkBtn}>관리자페이지</button>
                                    </Link>
                                ) : (
                                    <Link to="/user">
                                        <button style={styles.topLinkBtn}>마이페이지</button>
                                    </Link>
                                )}
                                <span style={styles.divider}>|</span>
                                <button style={styles.topLinkBtn} onClick={() => { logout(); }}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button style={styles.topLinkBtn}>로그인</button>
                                </Link>
                                <span style={styles.divider}>|</span>
                                <Link to="/register">
                                    <button style={styles.topLinkBtn}>회원가입</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/*메인 로고 & 주요 4개 메뉴 네비게이션*/}
            <nav style={styles.mainNav}>
                <div style={styles.navInner}>
                    {/* 로고 영역 */}
                    <div style={styles.logoArea} onClick={() => setActiveTab('지원금종류')}>
                        <span style={styles.logoBadge}>GOV</span>
                        <span style={styles.logoText}>지원금24</span>
                    </div>

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

            {/* 하단 동적 콘텐츠 출력 영역*/}
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


// 지원금종류
const TabSupportTypes = () => {
    const { session } = useAuth();
    const { grants, getGrants } = useGrant();
    const { favorites, createFavorite, getFavorites, deleteFavorite } = useFavorite();

    // 즐겨찾기 활성화 상태 관리 (grantId: boolean)
    const [favoriteMap, setFavoriteMap] = useState({});

    // 마우스 드래그 가로 스크롤 관련 State/Ref
    const scrollRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const isUser = session && (session.sessionUser.role === 'USER');

    // 즐겨찾기 토글 이벤트 핸들러
    const handleFavoriteToggle = async (grantId) => {
        if (!grantId) return;

        const isFavorited = favoriteMap[grantId];

        try {
            if (isFavorited) {
                await deleteFavorite(grantId);
                setFavoriteMap((prev) => ({
                    ...prev,
                    [grantId]: false
                }));
            } else {
                await createFavorite(grantId);
                setFavoriteMap((prev) => ({
                    ...prev,
                    [grantId]: true
                }));
            }
        } catch (error) {
            console.error("즐겨찾기 처리 실패:", error);
        }
    };

    // 마우스 드래그 이벤트 핸들러
    const handleMouseDown = (e) => {
        setIsMouseDown(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft); //스크롤 좌측끝에서 마우스까지의 X축 거리
        setScrollLeft(scrollRef.current.scrollLeft); //마우스 드래그 시도시 스크롤 좌측 끝 X축 위치 저장
    };

    const handleMouseLeaveOrUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; //마우스 다운 후 기준점 기준 이동한 X축 거리
        scrollRef.current.scrollLeft = scrollLeft - walk; //이동 거리에 따라 스크롤 기준 위치를 변경(스크롤 이동)
    };

    // 지원금 목록 및 즐겨찾기 목록 초기 조회(세션이 바뀔때만 실행)
    useEffect(() => {
        const fetchData = async () => {
            await getGrants();

            // 유저 세션이 있는 경우 즐겨찾기 목록 가져와서 맵핑 생성
            if (isUser) {
                try {
                    await getFavorites();
                    const favList = favorites;

                    const newFavMap = {};
                    favList.forEach((fav) => {
                        newFavMap[fav.grantId] = true;
                    });
                    setFavoriteMap(newFavMap);
                } catch (error) {
                    console.error("즐겨찾기 목록 조회 실패:", error);
                }
            }
        };

        fetchData();
    }, [session]);

    return (
        <div>
            {/* 카테고리별 설명 - 드래그 스크롤 영역 */}
            <div style={styles.sectionHeaderRow}>
                <h2 style={styles.sectionTitleNoBorder}>지금 많이 찾는 지원금 혜택</h2>
            </div>

            <div
                ref={scrollRef}
                style={{
                    ...styles.dragContainer,
                    cursor: isMouseDown ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
            >
                {CATEGORY_CARDS.map((item, idx) => (
                    <div key={idx} style={styles.dragCard}>
                        <span style={styles.cardCategory}>{item.category}</span>
                        <h3 style={styles.cardHeaderTitle}>{item.title}</h3>
                        <p style={styles.cardDescription}>{item.desc}</p>
                    </div>
                ))}
            </div>

            <div style={styles.sectionDivider} />

            {/* 실제 요청 응답 기반 현재 지원금 목록 */}
            <div style={styles.sectionHeaderRow}>
                <h2 style={styles.sectionTitleNoBorder}>현재 모집 중인 지원금 사업</h2>
                <span style={styles.totalBadge}>
                    총 <strong style={{ color: "#0056b3" }}>{grants?.length || 0}</strong>건
                </span>
            </div>

            <div style={styles.grantList}>
                {grants && grants.length > 0 ? (
                    grants.map((grant) => {
                        const statusInfo = GRANT_STATUS_MAP[grant.status] || {
                            label: grant.status || "미정",
                            bg: "#f1f5f9",
                            color: "#475569",
                        };

                        const isFavorited = favoriteMap[grant.grantId];

                        return (
                            <div key={grant.grantId} style={styles.grantCard}>
                                <div style={styles.grantCardHeader}>
                                    <div style={styles.headerLeft}>
                                        <span style={styles.grantNumber}>
                                            {grant.grantId ? `정책 NO.${String(grant.grantId).padStart(5, "0")}` : "정책"}
                                        </span>
                                        {grant.category && (
                                            <>
                                                <span style={styles.headerDivider}>|</span>
                                                <span style={styles.categoryTag}>
                                                    {GRANT_CATEGORY_MAP[grant.category] || grant.category}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div style={styles.headerRight}>
                                        {isUser && (
                                            <button
                                                type="button"
                                                onClick={() => handleFavoriteToggle(grant.grantId)}
                                                style={styles.favoriteBtn}
                                            >
                                                {isFavorited ? (
                                                    <span style={styles.starFilled}>★</span>
                                                ) : (
                                                    <span style={styles.starEmpty}>☆</span>
                                                )}
                                            </button>
                                        )}
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor: statusInfo.bg,
                                                color: statusInfo.color,
                                            }}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>

                                <h3 style={styles.grantTitle}>{grant.title}</h3>
                                <p style={styles.grantContent}>{grant.content}</p>

                                <div style={styles.metaRow}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지원금액</span>
                                        <span style={styles.metaValueHighlight}>
                                            {grant.amount ? `${Number(grant.amount).toLocaleString()}만원` : "-"}
                                        </span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지급주기</span>
                                        <span style={styles.metaValue}>
                                            {GRANT_CYCLE_MAP[grant.cycle] || grant.cycle || "-"}
                                        </span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>신청기간</span>
                                        <span style={styles.metaValue}>
                                            {formatDate(grant.startDate)} ~ {formatDate(grant.endDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={styles.emptyCard}>
                        <p style={styles.emptyText}>현재 등록된 지원금 사업이 존재하지 않습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// 지원금신청
const TabSupportApply = () => {
    // 모달 열림/닫힘 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h2 style={styles.sectionTitle}>지원금 원스톱 신청</h2>
            <div style={styles.infoBox}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>💡 신청 전 확인해주세요!</p>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    로그인 후 마이페이지에서 서류를 등록하고 진행해주세요.
                </p>
            </div>
            <div style={{ marginTop: '20px' }}>
                <button style={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                    내게 맞는 지원금 신청하기
                </button>
            </div>

            {/* 지원금 신청 모달 연동 */}
            <ApplicationForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

// 공지사항
const TabNotice = () => (
    <div>
        <h2 style={styles.sectionTitle}>공지사항</h2>
        <NoticeList />
    </div>
);

// 고객센터
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


const styles = {
    container: { fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: '#f8f9fa', minHeight: '100vh', color: '#333', width: '100%', boxSizing: 'border-box' },
    topHeader: { borderBottom: '1px solid #e9ecef', backgroundColor: '#fff', fontSize: '13px', width: '100%' },
    topHeaderInner: { maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '8px 20px', display: 'flex', justifyContent: 'flex-end', boxSizing: 'border-box' },
    authMenu: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
    topLinkBtn: { background: 'none', border: 'none', color: '#495057', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' },
    divider: { color: '#dee2e6' },
    mainNav: { backgroundColor: '#fff', borderBottom: '2px solid #0056b3', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', width: '100%' },
    navInner: { maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '70px', boxSizing: 'border-box', flexWrap: 'wrap', gap: '10px' },
    logoArea: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    logoBadge: { backgroundColor: '#0056b3', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' },
    logoText: { fontSize: '22px', fontWeight: 'bold', color: '#111' },
    menuList: { display: 'flex', listStyle: 'none', margin: 0, padding: 0, height: '100%', flexWrap: 'wrap' },
    menuItem: { padding: '12px 20px', display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 'bold', color: '#333', cursor: 'pointer', transition: 'all 0.2s ease', borderBottom: '3px solid transparent' },
    activeMenuItem: { color: '#0056b3', borderBottom: '3px solid #0056b3', backgroundColor: '#f1f5f9' },
    contentArea: { padding: '30px 20px', width: '100%', boxSizing: 'border-box' },
    contentInner: { maxWidth: '1200px', width: '100%', margin: '0 auto', backgroundColor: '#fff', padding: '30px 24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', minHeight: '400px', boxSizing: 'border-box' },
    sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#111111', marginBottom: '20px', borderBottom: '2px solid #111111', paddingBottom: '10px' },
    sectionTitleNoBorder: { fontSize: '20px', fontWeight: 'bold', color: '#111111', margin: 0 },
    sectionHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', borderBottom: '2px solid #111111', paddingBottom: '10px' },
    dragHint: { fontSize: '12px', color: '#666666', fontWeight: '500' },
    totalBadge: { fontSize: '14px', color: '#666666' },

    /* 가로 드래그 스크롤 관련 스타일 */
    dragContainer: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '12px', userSelect: 'none', scrollbarWidth: 'none', msOverflowStyle: 'none' },
    dragCard: { minWidth: '280px', maxWidth: '280px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#f8fafc', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', boxSizing: 'border-box', flexShrink: 0 },
    cardHeaderTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111111', margin: '8px 0' },
    cardDescription: { fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 },
    sectionDivider: { height: '1px', backgroundColor: '#e2e8f0', margin: '32px 0 24px 0' },

    /* 실시간 지원금 리스트 스타일 */
    grantList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    grantCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)' },
    grantCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
    headerRight: { display: 'flex', alignItems: 'center', gap: '8px' },
    favoriteBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 },
    starEmpty: { fontSize: '20px', color: '#94a3b8' },
    starFilled: { fontSize: '20px', color: '#f59e0b' },
    grantNumber: { fontSize: '12px', fontWeight: 'bold', color: '#888888', letterSpacing: '0.03em' },
    headerDivider: { fontSize: '11px', color: '#cbd5e1' },
    categoryTag: { fontSize: '12px', fontWeight: 'bold', color: '#0056b3' },
    statusBadge: { padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
    grantTitle: { fontSize: '17px', fontWeight: 'bold', color: '#111111', margin: 0 },
    grantContent: { fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' },
    metaRow: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f8f9fa', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '6px', marginTop: '4px', flexWrap: 'wrap' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '8px' },
    metaLabel: { fontSize: '13px', color: '#666666', fontWeight: '500' },
    metaValue: { fontSize: '13px', color: '#111111', fontWeight: 'bold' },
    metaValueHighlight: { fontSize: '14px', color: '#0056b3', fontWeight: 'bold' },
    metaDivider: { width: '1px', height: '12px', backgroundColor: '#cbd5e1' },

    /* 공통 기본 카드가이드 */
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', width: '100%' },
    card: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
    cardCategory: { fontSize: '12px', color: '#0056b3', fontWeight: 'bold' },
    infoBox: { backgroundColor: '#eef6ff', borderLeft: '4px solid #0056b3', padding: '16px', borderRadius: '4px', boxSizing: 'border-box' },
    primaryBtn: { backgroundColor: '#0056b3', color: '#fff', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', maxWidth: '100%' },
    emptyCard: { padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' },
    emptyText: { fontSize: '14px', color: '#666666', margin: 0 },
};