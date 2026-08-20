package kr.go.support.subsidy.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionData;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/session")
public class SessionController {

    //세션확인(Public)
    @GetMapping("/public")
    public ResponseApi<SessionData> getUserSession(HttpServletRequest request){
        HttpSession session = request.getSession(false);

        if(session == null || session.getAttribute("loginUser") == null || session.getAttribute("LAST_EXTENDED_TIME") == null){
            throw  new BusinessException(ErrorCode.INVALID_SESSION);
        }

        SessionUser sessionUser = (SessionUser)session.getAttribute("loginUser");
        Long lastExtendedTime = (Long)session.getAttribute("LAST_EXTENDED_TIME");
        SessionData sessionData = new SessionData(sessionUser, lastExtendedTime);

        return ResponseApi.success(sessionData);
    }

    //세션 연장
    @PostMapping("/extend")
    public ResponseApi<SessionData> extendSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("loginUser") == null || session.getAttribute("LAST_EXTENDED_TIME") == null){
            throw new BusinessException(ErrorCode.SESSION_NOT_FOUND);
        }

        session.setAttribute("LAST_EXTENDED_TIME", System.currentTimeMillis());

        SessionUser sessionUser = (SessionUser)session.getAttribute("loginUser");
        SessionData sessionData = new SessionData(sessionUser, System.currentTimeMillis());

        return ResponseApi.success(sessionData);
    }

    //세션 할당(취약점)
}
