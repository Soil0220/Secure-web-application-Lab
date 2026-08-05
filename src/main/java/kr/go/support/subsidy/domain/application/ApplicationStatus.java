package kr.go.support.subsidy.domain.application;

public enum ApplicationStatus {
    SUBMITTED,    // 접수됨
    UNDER_REVIEW, // 심사중
    APPROVED,     // 승인
    REJECTED,     // 반려
    PAID          // 지급완료
}