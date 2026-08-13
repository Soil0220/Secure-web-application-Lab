package kr.go.support.subsidy.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.user.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.UrlPathHelper;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SessionCheckfilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final UrlPathHelper urlPathHelper = new UrlPathHelper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String lookupPath = urlPathHelper.getLookupPathForRequest(request); // 세미콜론 및 경로 정규화 처리 완료된 URI

        //비로그인 통과
        if (pathMatcher.match("/api/**/public", lookupPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        //비로그인 거부
        HttpSession session = request.getSession(false);

        if (session == null){
            ErrorCode errorCode = ErrorCode.SESSION_NOT_FOUND;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }

        SessionUser sessionUser = (SessionUser) session.getAttribute("loginUser");

        if (sessionUser == null) {
            ErrorCode errorCode = ErrorCode.SESSION_NOT_FOUND;
            ResponseApi.sendError(response, objectMapper, errorCode);
            return;
        }

        //로그인 거부
        //Admin 권한 검사
        if (pathMatcher.match("/api/**/admin", lookupPath)) {
            if (sessionUser.getRole() != Role.ADMIN) {
                ErrorCode errorCode = ErrorCode.ADMIN_REQUIRED;
                ResponseApi.sendError(response, objectMapper, errorCode);
                return;
            }
        }

        //로그인 통과
        filterChain.doFilter(request, response);
    }
}