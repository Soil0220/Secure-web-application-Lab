package kr.go.support.subsidy.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.auth.SecurityUtils;
import kr.go.support.subsidy.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;
import tools.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;


@RequiredArgsConstructor
public class DoubleSubmitCookiefilter extends OncePerRequestFilter {

    private static final String XSRF_TOKEN = "XSRF-TOKEN";
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    private final SecurityUtils securityUtils;
    private final ObjectMapper objectMapper;

    //GET 메서드이지만 필터를 거쳐야하는 요청
    private static final List<String> FILTER_GET_PATTERNS = List.of(
            "/api/user"
    );

    //필터를 통과 시켜야하는 요청
    private static final List<String> BYPASS_PATTERNS = List.of(
            "/api/user/login/public",
            "/api/user/join/public"
    );

    //Safe 메서드 검증 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String method = request.getMethod();
        String uri = request.getRequestURI();

        //특정 URL 통과
        if (BYPASS_PATTERNS.stream().anyMatch(pattern -> pathMatcher.match(pattern, uri))) {
            return true;
        }

        //특정 GET메서드 제외 통과
        if ("GET".equals(method)) {
            boolean isMustFilter = FILTER_GET_PATTERNS.stream()
                    .anyMatch(pattern -> pathMatcher.match(pattern, uri));

            return !isMustFilter;
        }

        //읽기전용 메서드 통과
        return "HEAD".equals(method) || "OPTIONS".equals(method) || "TRACE".equals(method);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        //CSRF 토큰과 쿠키 추출
        String header = request.getHeader(XSRF_TOKEN);
        Cookie cookie = WebUtils.getCookie(request, XSRF_TOKEN);
        
        //헤더나 쿠키에 CSRF토큰 없거나 비어있을 시
        if(!requestValidate(header, cookie)){
            ErrorCode errorCode = ErrorCode.CSRF_TOKEN_NOT_FOUND;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }
        
        //헤더와 쿠키 불일치 거부
        if(!securityUtils.isEqual(header, cookie.getValue())){
            ErrorCode errorCode = ErrorCode.INVALID_CSRF_TOKEN;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }

        //모든 검증 통과
        filterChain.doFilter(request, response);
    }

    //요청 검증
    private boolean requestValidate(String header, Cookie cookie){

        return StringUtils.hasText(header) && cookie != null && StringUtils.hasText(cookie.getValue());
    }
}
