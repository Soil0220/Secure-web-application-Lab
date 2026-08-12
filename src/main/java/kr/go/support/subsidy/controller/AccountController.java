package kr.go.support.subsidy.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.auth.SecurityUtils;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.dto.user.UserBankAccountDto;
import kr.go.support.subsidy.dto.user.UserLoginDto;
import kr.go.support.subsidy.dto.user.UserJoinDto;
import kr.go.support.subsidy.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kr.go.support.subsidy.service.AccountService;

import java.security.Security;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class AccountController {

    private final AccountService accountService;
    private final SecurityUtils securityUtils;

    //회원가입(Public)
    @PostMapping("/join/public")
    public ResponseApi<Void> join(
            @Valid @RequestBody UserJoinDto dto){

        accountService.join(dto);
        return ResponseApi.success();
    }

    //로그인(Public)
    @PostMapping("/login/public")
    public ResponseApi<SessionUser> login(
            @Valid @RequestBody UserLoginDto userLoginDto,
            HttpServletRequest request,
            HttpServletResponse response){

        User loginUser = accountService.login(userLoginDto);

        //기존 세션 제거
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        //세션 재생성
        HttpSession session = request.getSession(true);
        SessionUser sessionUser = new SessionUser(loginUser);
        session.setAttribute("loginUser", sessionUser);

        String csrfToken = securityUtils.generateSecureToken();

        // Double Submit Cookie 발급 (JS가 읽어 헤더에 담아야 하므로 httpOnly=false)
        ResponseCookie csrfCookie = ResponseCookie.from("XSRF-TOKEN", csrfToken)
                .path("/")
                .httpOnly(false)
                .secure(false)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, csrfCookie.toString());

        return ResponseApi.success(sessionUser);
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseApi<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if(session != null) {
            session.invalidate();
        }
        return ResponseApi.success();
    }

    //계좌설정
    @PatchMapping
    public ResponseApi<Long> setBankAccount(
            @Valid @RequestBody UserBankAccountDto dto,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        Long userId = accountService.setBankAccount(sessionUser.getId(), dto);
        return ResponseApi.success(userId);
    }

    //계정조회(Admin)
    @GetMapping("/admin")
    public ResponseApi<List<UserResponseDto>> getUsers(){

        List<UserResponseDto> response = accountService.getUsers();
        return ResponseApi.success(response);
    }

    //계정삭제(Admin)
    @DeleteMapping("/{user_id}/admin")
    public ResponseApi<Long> deleteUser(
            @PathVariable Long user_id){

        Long response = accountService.deleteUser(user_id);
        return ResponseApi.success(response);
    }

    //세션확인(Public)
    @GetMapping("/session/public")
    public ResponseApi<SessionUser> getUserSession(HttpServletRequest request){
        HttpSession session = request.getSession(false);

        //세션이 없거나 loginUser가 없음
        if(session == null || session.getAttribute("loginUser") == null){

            return ResponseApi.error("401", "세션 정보가 유효하지 않습니다.");
        }

        SessionUser loginUser = (SessionUser) session.getAttribute("loginUser");

        return ResponseApi.success(loginUser);
    }
}
