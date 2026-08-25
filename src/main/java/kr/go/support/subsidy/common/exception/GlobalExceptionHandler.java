package kr.go.support.subsidy.common.exception;

import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.ResponseApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.MalformedURLException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 에러 발생시 가로채서 ResponseApi 규약으로 반환
    //TODO 추후 로그출력부분 넣어서 모니터링 페이지랑 연동 시키고 빅데이터기반 분석도 여유되면 넣기

    //비지니스 로직에 대한 커스텀 오류
    @ExceptionHandler(BusinessException.class)
    public ResponseApi<Void> handleBusinessException(BusinessException e, HttpServletResponse response) {
        ErrorCode errorCode = e.getErrorCode();
        response.setStatus(errorCode.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        return ResponseApi.error(errorCode.getCode(), e.getMessage());
    }

    //@Valid같은 Dto 유효성 검사 오류
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseApi<Void> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        // 첫 번째 에러 필드의 기본 메시지만 추출
        String errorMessage = e.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseApi.error("400", errorMessage);
    }

    //파라미터 타입 불일치
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseApi<Void> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        String message = String.format("파라미터 '%s'의 타입이 올바르지 않습니다.", e.getName());
        return ResponseApi.error("400", message);
    }

    //파라미터 누락
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseApi<Void> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        String message = String.format("필수 파라미터 '%s'가 누락되었습니다.", e.getParameterName());
        return ResponseApi.error("400", message);
    }

    //지원하지 않는 HTTP 메서드 호출
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseApi<Void> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        return ResponseApi.error("405", "지원하지 않는 HTTP 메서드 요청입니다.");
    }

    /*
    //그 외 모든 내부 오류(안전한 버전)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseApi<Void> handleAllUncaughtException(Exception e) {
        return ResponseApi.error("500", "서버 내부 오류가 발생했습니다.");
    }
    */

    //그 외 모든 내부 오류(취약한 버전, 스택 트레이스를 응답에 상세히 남깁니다.)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ResponseApi<Void> handleAllUncaughtException(Exception e) {
        return ResponseApi.error("500", "서버 내부 오류가 발생했습니다." + e.getMessage());
    }

}
