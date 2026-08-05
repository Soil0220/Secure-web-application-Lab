package kr.go.support.subsidy.common.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException{
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    //Checked Exception에 대한 스택트레이스까지 전달하기 위한 생성자
    public BusinessException(ErrorCode errorCode, Throwable cause){
        super(cause.getMessage(), cause);
        this.errorCode = errorCode;
    }
}
