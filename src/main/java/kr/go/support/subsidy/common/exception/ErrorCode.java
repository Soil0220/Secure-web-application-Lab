package kr.go.support.subsidy.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    //인증 및 인가
    SESSION_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "로그인이 필요한 서비스입니다."),
    ADMIN_REQUIRED(HttpStatus.FORBIDDEN, "R002", "어드민 권한이 필요합니다."),
    DUPLICATE_REQUEST(HttpStatus.CONFLICT, "R003", "중복 요청입니다."),
    TIMEOUT_REQUEST(HttpStatus.CONFLICT, "R004", "오래된 요청입니다."),
    HEADER_REQUIRED(HttpStatus.BAD_REQUEST, "R005", "헤더 정보가 필요합니다."),
    CSRF_TOKEN_NOT_FOUND(HttpStatus.BAD_REQUEST, "R006", "CSRF 토큰이 존재하지 않습니다."),
    INVALID_CSRF_TOKEN(HttpStatus.UNAUTHORIZED, "R007", "CSRF 토큰이 일치하지 않습니다."),
    INVALID_SESSION(HttpStatus.UNAUTHORIZED, "R008", "유효하지 않은 세션정보입니다."),

    // Application
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "A001", "지원금 신청이 존재하지 않습니다."),

    // Document
    DOCUMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "서류정보가 존재하지 않습니다."),
    DOCUMENT_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "D002", "요청하신 파일을 찾을 수 없습니다."),
    DOCUMENT_FILE_SAVE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "D003", "파일 저장 중 오류가 발생했습니다."),
    INVALID_FILE_URL(HttpStatus.INTERNAL_SERVER_ERROR, "D004", "비정상적인 URL 형식입니다."),

    // Favorite
    FAVORITE_NOT_FOUND(HttpStatus.NOT_FOUND, "F001", "즐겨찾기 정보를 찾을 수 없습니다."),

    // Grant
    GRANT_NOT_FOUND(HttpStatus.NOT_FOUND, "G001", "지원금 제도가 존재하지 않습니다."),
    GRANT_NOT_RECRUITING(HttpStatus.BAD_REQUEST, "G002", "모집 대상 지원금 제도가 아닙니다."),

    // Inquiry
    INQUIRY_NOT_FOUND(HttpStatus.NOT_FOUND, "I001", "문의가 존재하지 않습니다."),

    // Notice
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "N001", "공지사항이 존재하지 않습니다."),

    // Account
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "U001", "아이디 또는 비밀번호가 일치하지 않습니다."),
    USER_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "U002", "서비스 이용 중 오류가 발생했습니다."),
    DUPLICATE_EMAIL_USERNAME(HttpStatus.CONFLICT, "U003", "이미 계정을 보유하고 있습니다."),

    // FileUploadValidator
    FILE_NOT_FOUND(HttpStatus.BAD_REQUEST, "FU001", "파일이 존재하지 않습니다."),
    FILE_NAME_NOT_FOUND(HttpStatus.BAD_REQUEST, "FU002", "파일명이 존재하지 않습니다."),
    INVALID_FILE_NAME(HttpStatus.BAD_REQUEST, "FU003", "허용되지 않는 파일명입니다."),
    INVALID_FILE_EXTENSION(HttpStatus.BAD_REQUEST, "FU004", "허용되지 않는 파일 확장자입니다."),
    INVALID_CONTENT_TYPE(HttpStatus.BAD_REQUEST, "FU005", "허용되지 않는 MIME TYPE입니다."),
    INVALID_ACTUAL_FILE_TYPE(HttpStatus.BAD_REQUEST, "FU006", "파일의 실제 형식이 허용되지 않았습니다."),
    FILE_TYPE_CHECK_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "FU007", "파일 형식을 확인할 수 없습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
