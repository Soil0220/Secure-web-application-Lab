package kr.go.support.subsidy.Interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.service.LogService;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;


@Component
@RequiredArgsConstructor
public class RequestTracingInterceptor implements HandlerInterceptor {

    private static final String HEADER_REQUEST_ID = "X-Request-Id";
    private static final String HEADER_REQUEST_TIME = "X-Request-Time";

    private final LogService logService;
    private final ObjectMapper objectMapper; // ResponseApi 객체를 JSON으로 직렬화하기 위해 주입
    private final ApplicationEventPublisher eventPublisher; // 동기로 돌아가는 스프링부트를 고려해 로그저장은 비동기로 처리


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String requestId = request.getHeader(HEADER_REQUEST_ID);
        String requestTime = request.getHeader(HEADER_REQUEST_TIME);

        // 상태 변경 메서드(POST, PUT, PATCH, DELETE)에 대해서만 중복 체크
        if (requestValidate(requestId, requestTime) && isStateChangingMethod(request.getMethod())) {

            // 중복 요청 검증
            if (logService.checkLog(requestId)) {throw new BusinessException(ErrorCode.DUPLICATE_REQUEST);}

            // 로그 추적용 MDC 주입 (GET 요청이라도 requestId 추적은 유지)
            MDC.put("requestId", requestId);
        }

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        MDC.clear(); // ThreadLocal 정리

        String requestId = request.getHeader(HEADER_REQUEST_ID);
        String requestTime = request.getHeader(HEADER_REQUEST_TIME);

        LogRequestDto logRequestDto = new LogRequestDto(requestId, requestTime, request.getRequestURI());

        //이벤트 등록
        eventPublisher.publishEvent(logRequestDto);

    }

    //요청 검증
    public boolean requestValidate(String requestId, String requestTime){

        return StringUtils.hasText(requestId) && StringUtils.hasText(requestTime);
    }

    // 상태 변경 메서드 여부 판별
    private boolean isStateChangingMethod(String method) {
        return HttpMethod.POST.matches(method) ||
                HttpMethod.PUT.matches(method) ||
                HttpMethod.PATCH.matches(method) ||
                HttpMethod.DELETE.matches(method);
    }
}