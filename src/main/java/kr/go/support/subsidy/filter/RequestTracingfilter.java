package kr.go.support.subsidy.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class RequestTracingfilter extends OncePerRequestFilter {

    private static final String HEADER_REQUEST_ID = "X-Request-Id";
    private static final String HEADER_REQUEST_TIME = "X-Request-Time";

    private final LogService logService;
    private final ObjectMapper objectMapper; // ResponseApi 객체를 JSON으로 직렬화하기 위해 주입
    private final ApplicationEventPublisher eventPublisher; // 동기로 돌아가는 스프링부트를 고려해 로그저장은 비동기로 처리

    //Safe 메서드 검증 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        //TODO GET 메서드에 대해서는 HTTP GET FLOODING 공격 등을 탐지하기 위해 시간당 집계처리 필요
        String method = request.getMethod();
        return "GET".equals(method) || "HEAD".equals(method) || "OPTIONS".equals(method) || "TRACE".equals(method);
    }

    //상태 변경 메서드에 대해서만 검증
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = request.getHeader(HEADER_REQUEST_ID);
        String requestTime = request.getHeader(HEADER_REQUEST_TIME);

        //필수 헤더 누락
        if (!requestValidate(requestId, requestTime)){
            ErrorCode errorCode = ErrorCode.HEADER_REQUIRED;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }

        //이벤트 등록을 통해 비동기 방식으로 요청 로그 저장(추후 모니터링 페이지 분석용도)
        LogRequestDto logRequestDto = new LogRequestDto(requestId, Instant.parse(requestTime), request.getRequestURI());
        eventPublisher.publishEvent(logRequestDto);

        //중복 체크
        if (logService.checkLog(requestId)) {
            ErrorCode errorCode = ErrorCode.DUPLICATE_REQUEST;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }

        //타임아웃 체크
        if (logService.checkTime(Instant.parse(requestTime))) {
            ErrorCode errorCode = ErrorCode.TIMEOUT_REQUEST;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }


        //모든 검증 통과
        filterChain.doFilter(request, response);
    }

    //요청 검증
    public boolean requestValidate(String requestId, String requestTime){

        return StringUtils.hasText(requestId) && StringUtils.hasText(requestTime);
    }
}