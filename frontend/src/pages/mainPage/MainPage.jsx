import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../../contexts/authContext/UseAuth.jsx";
import { useLoading } from "../../contexts/loadingContext/UseLoading.jsx";
import { useGrant } from "../../contexts/grantContext/UseGrant.jsx";
import { useFavorite } from "../../contexts/favoriteContext/UseFavorite.jsx";
import NoticeList from "../../components/NoticeList.jsx";
import ApplicationForm from "../../components/ApplicationForm.jsx";
import { Link } from 'react-router-dom';

// 1. Enum 상수 매핑 정의
const CATEGORY_MAP = {
    YOUTH: "청년",
    BUSINESS_STARTUP: "창업",
    LIVING_WELFARE: "생활 / 복지",
    HOUSING: "주거",
    HEALTH_CARE: "건강 / 의료"
};

const CYCLE_MAP = {
    LUMP_SUM: "일시금",
    DAILY: "매일",
    WEEKLY: "매주",
    MONTHLY: "매월",
    YEARLY: "매년"
};

const STATUS_MAP = {
    PREPARING: { label: "준비중", bg: "#fef7e0", color: "#b06000" },
    RECRUITING: { label: "모집중", bg: "#e6f4ea", color: "#137333" },
    CLOSED: { label: "마감", bg: "#fce8e6", color: "#c5221f" }
};

// 날짜 포맷팅 (YYYY.MM.DD)
const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
};

// 5개 카테고리 정보 데이터
const CATEGORY_CARDS = [
    {
        category: "청년",
        title: "청년 지원 혜택",
        desc: "청년월세 특별지원, 자산 형성 지원금 등 청년층의 자립과 주거·일자리를 지원합니다."
    },
    {
        category: "창업",
        title: "창업 / 소상공인 혜택",
        desc: "초기 창업 패키지, 사업화 자금, 경영 안정 자금 등 유망 창업 기업과 소상공인을 지원합니다."
    },
    {
        category: "생활 / 복지",
        title: "생활 / 복지 혜택",
        desc: "긴급 생계지원금, 저소득층 자립 지원, 취약계층 맞춤형 바우처 등 생활 안정을 지원합니다."
    },
    {
        category: "주거",
        title: "주거 금융 혜택",
        desc: "전월세 보증금 이자 지원, 주거급여, 공공임대주택 연계 등 주거비 부담을 경감해 드립니다."
    },
    {
        category: "건강 / 의료",
        title: "건강 / 의료 혜택",
        desc: "고액 의료비 지원, 본인부담상한제, 정신건강 검진비 등 국민의 건강증진과 의료비를 지원합니다."
    }
];

const MainPage = () => {
    const { session, setSession, checkSession, logout } = useAuth();
    const { loading, setLoading } = useLoading();

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
            if (response.success) {
                setSession(response.data);
            } else {
                setSession(null);
            }
            setLoading(false);
        };

        run();
    }, []);

    if (loading) {
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

// ------------------- 탭 컴포넌트 정의 -------------------

// 1. 지원금종류
const TabSupportTypes = () => {
    const { session } = useAuth();
    const { grants, getGrants } = useGrant();
    const { createFavorite, getFavorites, deleteFavorite } = useFavorite();

    // 즐겨찾기 활성화 상태 관리 (grantId: boolean)
    const [favoriteMap, setFavoriteMap] = useState({});

    // 마우스 드래그 가로 스크롤 관련 State/Ref
    const scrollRef = useRef(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const isUser = session && (session.role === 'USER' || session.role === 'User');

    // 지원금 목록 및 즐겨찾기 목록 초기 조회
    useEffect(() => {
        const fetchData = async () => {
            await getGrants();

            // 유저 세션이 있는 경우 즐겨찾기 목록 가져와서 맵핑 생성
            if (isUser) {
                try {
                    const response = await getFavorites();
                    const favList = Array.isArray(response) ? response : response?.data || [];

                    const newFavMap = {};
                    favList.forEach((fav) => {
                        if (fav.grantId) {
                            newFavMap[fav.grantId] = true;
                        }
                    });
                    setFavoriteMap(newFavMap);
                } catch (error) {
                    console.error("즐겨찾기 목록 조회 실패:", error);
                }
            }
        };

        fetchData();
    }, [session]);

    // 즐겨찾기 토글 이벤트 핸들러 (등록 / 삭제)
    const handleFavoriteToggle = async (grantId) => {
        if (!grantId) return;

        const isFavorited = !!favoriteMap[grantId];

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
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeaveOrUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div>
            {/* (1) 카테고리별 설명 - 드래그 스크롤 영역 */}
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

            {/* 구분선 */}
            <div style={styles.sectionDivider} />

            {/* (2) 실제 요청 응답 기반 현재 지원금 목록 */}
            <div style={styles.sectionHeaderRow}>
                <h2 style={styles.sectionTitleNoBorder}>현재 모집 중인 지원금 사업</h2>
                <span style={styles.totalBadge}>
                    총 <strong style={{ color: "#0056b3" }}>{grants?.length || 0}</strong>건
                </span>
            </div>

            <div style={styles.grantList}>
                {grants && grants.length > 0 ? (
                    grants.map((grant) => {
                        const statusInfo = STATUS_MAP[grant.status] || {
                            label: grant.status || "미정",
                            bg: "#f1f5f9",
                            color: "#475569",
                        };

                        const isFavorited = !!favoriteMap[grant.grantId];

                        return (
                            <div key={grant.grantId || grant.title} style={styles.grantCard}>
                                <div style={styles.grantCardHeader}>
                                    <div style={styles.headerLeft}>
                                        <span style={styles.grantNumber}>
                                            {grant.grantId ? `정책 NO.${String(grant.grantId).padStart(5, "0")}` : "신규 정책"}
                                        </span>
                                        {grant.category && (
                                            <>
                                                <span style={styles.headerDivider}>|</span>
                                                <span style={styles.categoryTag}>
                                                    {CATEGORY_MAP[grant.category] || grant.category}
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
                                                title={isFavorited ? "즐겨찾기 해제" : "즐겨찾기 추가"}
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
                                            {grant.amount ? (isNaN(grant.amount) ? grant.amount : `${Number(grant.amount).toLocaleString()}만원`) : "-"}
                                        </span>
                                    </div>
                                    <div style={styles.metaDivider} />
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaLabel}>지급주기</span>
                                        <span style={styles.metaValue}>
                                            {CYCLE_MAP[grant.cycle] || grant.cycle || "-"}
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

// 2. 지원금신청
const TabSupportApply = () => {
    // 모달 열림/닫힘 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h2 style={styles.sectionTitle}>지원금 원스톱 신청</h2>
            <div style={styles.infoBox}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>💡 신청 전 확인해주세요!</p>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    로그인 후 신청 시 기본 정보가 자동 입력되어 더 빠른 신청이 가능합니다.
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

// ------------------- 스타일 객체 -------------------

const styles = {
    container: {
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#333',
        width: '100%',
        boxSizing: 'border-box',
    },
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
        boxSizing: 'border-box',
    },
    authMenu: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
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
        flexWrap: 'wrap',
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
        flexWrap: 'wrap',
    },
    menuItem: {
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
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
        boxSizing: 'border-box',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111111',
        marginBottom: '20px',
        borderBottom: '2px solid #111111',
        paddingBottom: '10px',
    },
    sectionTitleNoBorder: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#111111',
        margin: 0,
    },
    sectionHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '16px',
        borderBottom: '2px solid #111111',
        paddingBottom: '10px',
    },
    dragHint: {
        fontSize: '12px',
        color: '#666666',
        fontWeight: '500',
    },
    totalBadge: {
        fontSize: '14px',
        color: '#666666',
    },

    /* 가로 드래그 스크롤 관련 스타일 */
    dragContainer: {
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '12px',
        userSelect: 'none',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    dragCard: {
        minWidth: '280px',
        maxWidth: '280px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f8fafc',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        flexShrink: 0,
    },
    cardHeaderTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#111111',
        margin: '8px 0',
    },
    cardDescription: {
        fontSize: '13px',
        color: '#475569',
        lineHeight: '1.5',
        margin: 0,
    },
    sectionDivider: {
        height: '1px',
        backgroundColor: '#e2e8f0',
        margin: '32px 0 24px 0',
    },

    /* 실시간 지원금 리스트 스타일 */
    grantList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    grantCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
    },
    grantCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    favoriteBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
    },
    starEmpty: {
        fontSize: '20px',
        color: '#94a3b8',
    },
    starFilled: {
        fontSize: '20px',
        color: '#f59e0b',
    },
    grantNumber: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#888888',
        letterSpacing: '0.03em',
    },
    headerDivider: {
        fontSize: '11px',
        color: '#cbd5e1',
    },
    categoryTag: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#0056b3',
    },
    statusBadge: {
        padding: "4px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
    },
    grantTitle: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: '#111111',
        margin: 0,
    },
    grantContent: {
        fontSize: '14px',
        color: '#333333',
        lineHeight: '1.5',
        margin: 0,
        whiteSpace: 'pre-line',
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e2e8f0',
        padding: '10px 16px',
        borderRadius: '6px',
        marginTop: '4px',
        flexWrap: 'wrap',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    metaLabel: {
        fontSize: '13px',
        color: '#666666',
        fontWeight: '500',
    },
    metaValue: {
        fontSize: '13px',
        color: '#111111',
        fontWeight: 'bold',
    },
    metaValueHighlight: {
        fontSize: '14px',
        color: '#0056b3',
        fontWeight: 'bold',
    },
    metaDivider: {
        width: '1px',
        height: '12px',
        backgroundColor: '#cbd5e1',
    },

    /* 공통 기본 카드가이드 */
    cardGrid: {
        display: 'grid',
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
        maxWidth: '100%',
    },
    emptyCard: {
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
    },
    emptyText: {
        fontSize: "14px",
        color: "#666666",
        margin: 0,
    },
};

export default MainPage;