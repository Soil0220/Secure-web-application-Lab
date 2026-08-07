package kr.go.support.subsidy.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    //TODO 노출 정보 최소화 작업 해야함

    // Application
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND,"A001", "해당 ID의 지원금 제도가 존재하지 않습니다."),


    // Document
    DOCUMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "D001", "서류정보가 존재하지 않습니다."),
    DOCUMENT_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "D002", "물리 파일이 존재하지 않거나 읽을 수 없습니다."),
    DOCUMENT_FILE_SAVE_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "D003", "파일 저장 중 오류가 발생했습니다."),
    INVALID_FILE_URL(HttpStatus.INTERNAL_SERVER_ERROR, "D004", "비정상적인 URL 형식입니다."),

    // Favorite
    FAVORITE_NOT_FOUND(HttpStatus.NOT_FOUND, "F001", "즐겨찾기 정보를 찾을 수 없습니다."),


    // Grant
    GRANT_NOT_FOUND(HttpStatus.NOT_FOUND, "G001", "해당 ID의 신청내역이 존재하지 않습니다."),


    // Inquiry
    INQUIRY_NOT_FOUND(HttpStatus.NOT_FOUND, "I001", "해당 ID의 문의가 존재하지 않습니다."),


    // Notice
    NOTICE_NOT_FOUND(HttpStatus.NOT_FOUND, "N001", "해당 ID의 공지사항이 존재하지 않습니다."),


    // Account
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "해당 유저가 존재하지 않습니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "U002", "비밀번호가 일치하지 않습니다."),
    DUPLICATE_USERNAME(HttpStatus.BAD_REQUEST, "U003", "동일한 아이디가 이미 존재합니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
