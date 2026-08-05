package kr.go.support.subsidy.Interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
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

        HttpSession session = request.getSession(false);
        SessionUser sessionUser = (SessionUser) session.getAttribute("loginUser");
        String uri = request.getRequestURI();

        // CORS Preflight(OPTIONS) 요청은 통과
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        //비로그인 통과
        if (uri.contains("/public")) {
            return true;
        }

        // 로그인 통과
        if (session == null || sessionUser == null) {

            // 401 Unauthorized 에러 응답 전송
            ResponseApi.error("401", "로그인이 필요한 서비스입니다.")
                    .send(response, HttpServletResponse.SC_UNAUTHORIZED, objectMapper);

            return false;
        }

        //Admin 권한 검사
        if (uri.contains("/admin")) {
            if (sessionUser.getRole() != Role.ADMIN) {
                ResponseApi.error("403", "실행 권한이 없습니다.");

                return false;
            }
        }

        return true;
    }
}