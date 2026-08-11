package kr.go.support.subsidy.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
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
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RequestTracingfilter extends OncePerRequestFilter {

    private static final String HEADER_REQUEST_ID = "X-Request-Id";
    private static final String HEADER_REQUEST_TIME = "X-Request-Time";

    private final LogService logService;
    private final ObjectMapper objectMapper; // ResponseApi 객체를 JSON으로 직렬화하기 위해 주입
    private final ApplicationEventPublisher eventPublisher; // 동기로 돌아가는 스프링부트를 고려해 로그저장은 비동기로 처리


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = request.getHeader(HEADER_REQUEST_ID);
        String requestTime = request.getHeader(HEADER_REQUEST_TIME);

        //이벤트 등록을 통해 비동기 방식으로 요청 로그 저장(추후 모니터링 페이지 분석용도)
        LogRequestDto logRequestDto = new LogRequestDto(requestId, requestTime, request.getRequestURI());
        eventPublisher.publishEvent(logRequestDto);

        //필수 헤더 누락
        if (!requestValidate(requestId, requestTime)){
            ErrorCode errorCode = ErrorCode.HEADER_NOT_REQUIRED;
            ResponseApi.error(errorCode.getCode(), errorCode.getMessage()).send(response, objectMapper);
            return;
        }

        // 상태 변경 메서드(POST, PUT, PATCH, DELETE)에 대해서만 중복 체크
        if (isStateChangingMethod(request.getMethod()) && logService.checkLog(requestId)) {

            ErrorCode errorCode = ErrorCode.DUPLICATE_REQUEST;
            ResponseApi.error(errorCode.getCode(), errorCode.getMessage()).send(response, objectMapper);
            return;
        }

        filterChain.doFilter(request, response);

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