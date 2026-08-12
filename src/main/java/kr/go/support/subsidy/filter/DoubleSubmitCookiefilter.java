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
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class DoubleSubmitCookiefilter extends OncePerRequestFilter {

    private static final String XSRF_TOKEN = "XSRF-TOKEN";
    private final ObjectMapper objectMapper;
    private final SecurityUtils securityUtils;

    //Safe 메서드 검증 제외
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String method = request.getMethod();
        return "GET".equals(method) || "HEAD".equals(method) || "OPTIONS".equals(method) || "TRACE".equals(method)
                || request.getRequestURI().equals("/api/user/login/public") || request.getRequestURI().equals("/api/user/join/public");
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
            ResponseApi.error(errorCode.getCode(), errorCode.getMessage()).send(response, objectMapper);
            return;
        }
        
        //헤더와 쿠키 불일치 거부
        if(!securityUtils.isEqual(header, cookie.getValue())){
            ErrorCode errorCode = ErrorCode.INVALID_CSRF_TOKEN;
            ResponseApi.error(errorCode.getCode(), errorCode.getMessage()).send(response, objectMapper);
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
