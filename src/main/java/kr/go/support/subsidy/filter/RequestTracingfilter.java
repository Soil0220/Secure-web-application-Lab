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
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Instant;
import java.util.List;


@RequiredArgsConstructor
public class RequestTracingfilter extends OncePerRequestFilter {

    private static final String HEADER_REQUEST_ID = "X-Request-Id";
    private static final String HEADER_REQUEST_TIME = "X-Request-Time";
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private final LogService logService;
    private final ObjectMapper objectMapper;
    private final ApplicationEventPublisher eventPublisher;

    //GET 메서드이지만 필터를 거쳐야하는 요청
    private static final List<String> FILTER_GET_PATTERNS = List.of(
            "/api/user"
    );


    //Safe 메서드 검증 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        //TODO GET 메서드에 대해서는 HTTP GET FLOODING 공격 등을 탐지하기 위해 시간당 집계처리 필요
        String method = request.getMethod();
        String uri = request.getRequestURI();

        //특정 GET메서드 제외 통과
        if ("GET".equals(method)) {
            boolean isMustFilter = FILTER_GET_PATTERNS.stream()
                    .anyMatch(pattern -> pathMatcher.match(pattern, uri));

            return !isMustFilter;
        }

        return "HEAD".equals(method) || "OPTIONS".equals(method) || "TRACE".equals(method);
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