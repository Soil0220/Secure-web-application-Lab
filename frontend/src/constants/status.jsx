

//GRANT
export const GRANT_STATUS_MAP = {
    PREPARING: { label: "준비중", bg: "#fef7e0", color: "#b06000" },
    RECRUITING: { label: "모집중", bg: "#e6f4ea", color: "#137333" },
    CLOSED: { label: "마감", bg: "#fce8e6", color: "#c5221f" }
};

export const GRANT_CATEGORY_MAP = {
    YOUTH_EMPLOYMENT: "청년",
    BUSINESS_STARTUP: "창업",
    LIVING_WELFARE: "생활 / 복지",
    HOUSING_FINANCE: "주거",
    HEALTH_CARE: "건강 / 의료"
};

export const GRANT_CYCLE_MAP = {
    LUMP_SUM: "일시금",
    DAILY: "매일",
    WEEKLY: "매주",
    MONTHLY: "매월",
    YEARLY: "매년"
};

//APPLICATION
export const APPLICATION_STATUS_MAP = {
    SUBMITTED: { label: "접수됨", bg: "#fff7ed", color: "#c2410c" },
    UNDER_REVIEW: { label: "심사중", bg: "#eef6ff", color: "#0056b3" },
    APPROVED: { label: "승인", bg: "#f0fdf4", color: "#16a34a" },
    REJECTED: { label: "반려", bg: "#fef2f2", color: "#dc2626" },
    PAID: { label: "지급완료", bg: "#dcfce7", color: "#15803d" },
};

//DOCUMENT
export const DOC_TYPE_MAP = {
    RESIDENT_REGISTRATION_COPY: "주민등록초본",
    FAMILY_RELATION_CERTIFICATE: "가족관계증명서",
    INCOME_VERIFICATION_DOCUMENT: "소득 증빙 서류",
    TAX_PAYMENT_CERTIFICATE: "납세증명서",
    BANK_ACCOUNT_STATEMENT: "통장 사본"
};


//INQUIRY
export const INQUIRY_STATUS_MAP = {
    ANSWERED: { label: "답변완료", bg: "#e6f4ea", color: "#137333" },
    PENDING: { label: "답변대기", bg: "#fef7e0", color: "#b06000" },
};

export const DEFAULT_STATUS = { label: "알 수 없음", bg: "#f3f4f6", color: "#6b7280" };