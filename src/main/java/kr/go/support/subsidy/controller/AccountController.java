package kr.go.support.subsidy.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionData;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.auth.LoginRateLimit;
import kr.go.support.subsidy.common.auth.SecurityUtils;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.dto.user.UserBankAccountDto;
import kr.go.support.subsidy.dto.user.UserLoginDto;
import kr.go.support.subsidy.dto.user.UserJoinDto;
import kr.go.support.subsidy.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import kr.go.support.subsidy.service.AccountService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class AccountController {

    private final AccountService accountService;
    private final SecurityUtils securityUtils;

    //계정 권한 변경(Admin)
    @PatchMapping("/role/{userId}/admin")
    public ResponseApi<Void> updateRole(
            @PathVariable("userId") Long userId,
            @RequestBody Map<String, Role> payload){

        accountService.updateRole(userId, payload.get("role"));
        return ResponseApi.success();
    }

    //회원가입(Public)
    @PostMapping("/join/public")
    public ResponseApi<Void> join(
            @Valid @RequestBody UserJoinDto dto){

        accountService.join(dto);
        return ResponseApi.success();
    }

    //로그인(Public)
    @PostMapping("/login/public")
    public ResponseApi<SessionData> login(
            @Valid @RequestBody UserLoginDto userLoginDto,
            HttpServletRequest request,
            HttpServletResponse response){

        //TODO 추후 프록시서버, 로드밸런싱을 고려할때에는 클라이언트 IP추출 관련해서 변경해야함
        User loginUser = accountService.login(userLoginDto, request.getRemoteAddr());

        //기존 세션 제거
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        //세션 재생성
        HttpSession session = request.getSession(true);
        SessionUser sessionUser = new SessionUser(loginUser);
        SessionData sessionData = new SessionData(sessionUser, System.currentTimeMillis());

        session.setAttribute("loginUser", sessionUser);
        session.setAttribute("LAST_EXTENDED_TIME", System.currentTimeMillis());

        String csrfToken = securityUtils.generateSecureToken();

        // Double Submit Cookie 발급 (JS가 읽어 헤더에 담아야 하므로 httpOnly=false)
        ResponseCookie csrfCookie = ResponseCookie.from("XSRF-TOKEN", csrfToken)
                .path("/")
                .httpOnly(false)
                .secure(false)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, csrfCookie.toString());

        return ResponseApi.success(sessionData);
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

    /*본인 계정조회(안전한 버전)
    @GetMapping
    public ResponseApi<UserResponseDto> getUsers(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        UserResponseDto response = accountService.getUser(sessionUser.getId());
        return ResponseApi.success(response);
    }*/

    /*본인 계정조회(취약한 버전, 부적절한 세션검증, 클라이언트 신뢰)*/
    @GetMapping("/{userId}")
    public ResponseApi<UserResponseDto> getUsers(
            @PathVariable Long userId){

        UserResponseDto response = accountService.getUser(userId);
        return ResponseApi.success(response);
    }

    //계정조회(Admin)
    @GetMapping("/admin")
    public ResponseApi<List<UserResponseDto>> getUsers(){

        List<UserResponseDto> response = accountService.getUsers();
        return ResponseApi.success(response);
    }

    //계정삭제(Admin)
    @DeleteMapping("/{userid}/admin")
    public ResponseApi<Long> deleteUser(
            @PathVariable Long userid){

        Long response = accountService.deleteUser(userid);
        return ResponseApi.success(response);
    }

}
