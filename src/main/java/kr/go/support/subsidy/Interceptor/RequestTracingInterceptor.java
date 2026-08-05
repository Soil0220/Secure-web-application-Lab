package kr.go.support.subsidy.Interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.domain.log.RequestLog;
import kr.go.support.subsidy.domain.log.RequestLogRepository;
import kr.go.support.subsidy.dto.RequestLogDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;


@Component
@RequiredArgsConstructor
public class RequestTracingInterceptor implements HandlerInterceptor {

    private static final String HEADER_REQUEST_ID = "X-Request-Id";
    private static final String HEADER_REQUEST_TIME = "X-Request-Time";

    private final RequestLogRepository requestLogRepository;
    private final ObjectMapper objectMapper; // ResponseApi 객체를 JSON으로 직렬화하기 위해 주입


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestId = request.getHeader(HEADER_REQUEST_ID);
        String requestTime = request.getHeader(HEADER_REQUEST_TIME);

        if (requestId != null && !requestId.isBlank()) {

            // 1. 상태 변경 메서드(POST, PUT, PATCH, DELETE)에 대해서만 중복 체크 및 저장 수행
            if (isStateChangingMethod(request.getMethod())) {

                // 중복 요청 검증
                if (requestLogRepository.existsByRequestId(requestId)) {
                    ResponseApi.error("409", "Duplicate Request Detected").send(response, HttpServletResponse.SC_CONFLICT, objectMapper);
                    return false; // Controller 진입 차단
                }

                // DB 기록
                if (requestTime != null && !requestTime.isBlank()) {
                    RequestLogDto requestLogDto = new RequestLogDto(requestId, requestTime, request.getRequestURI());

                    RequestLog requestLog = requestLogDto.toEntity();
                    requestLogRepository.save(requestLog);
                }
            }

            // 2. 로그 추적용 MDC 주입 (GET 요청이라도 requestId 추적은 유지)
            MDC.put("requestId", requestId);
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        MDC.clear(); // ThreadLocal 정리
    }

    // 상태 변경 메서드 여부 판별
    private boolean isStateChangingMethod(String method) {
        return HttpMethod.POST.matches(method) ||
                HttpMethod.PUT.matches(method) ||
                HttpMethod.PATCH.matches(method) ||
                HttpMethod.DELETE.matches(method);
    }
}