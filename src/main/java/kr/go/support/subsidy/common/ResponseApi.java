package kr.go.support.subsidy.common;

import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.exception.ErrorCode;
import lombok.Getter;
import org.springframework.http.MediaType;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;

@Getter
public class ResponseApi<T> {
    private final boolean success;
    private final String code;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;

    private ResponseApi(boolean success, String code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // 성공 응답 (데이터 있음)
    public static <T> ResponseApi<T> success(T data) {
        return new ResponseApi<>(true, "200", "SUCCESS", data);
    }

    // 성공 응답 (데이터 없음)
    public static <T> ResponseApi<T> success() {
        return new ResponseApi<>(true, "200", "SUCCESS", null);
    }

    // 실패/에러 응답
    public static <T> ResponseApi<T> error(String code, String message) {
        return new ResponseApi<>(false, code, message, null);
    }

    //필터전용 응답
    public void send(HttpServletResponse response, ObjectMapper objectMapper) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String jsonResult = objectMapper.writeValueAsString(this);
        response.getWriter().write(jsonResult);
    }
}
