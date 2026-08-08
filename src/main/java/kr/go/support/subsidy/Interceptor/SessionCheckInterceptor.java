package kr.go.support.subsidy.Interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.user.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class SessionCheckInterceptor implements HandlerInterceptor {

    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // CORS Preflight(OPTIONS) 요청은 통과
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        //비로그인 통과
        if (uri.contains("/public")) {
            return true;
        }

        //비로그인 거부
        HttpSession session = request.getSession(false);

        if (session == null){throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);}

        SessionUser sessionUser = (SessionUser) session.getAttribute("loginUser");

        //Admin 권한 검사
        if (uri.contains("/admin")) {
            if (sessionUser.getRole() != Role.ADMIN) {throw new BusinessException(ErrorCode.ADMIN_REQUIRED);}}

        return true;
    }
}