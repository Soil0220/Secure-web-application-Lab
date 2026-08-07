package kr.go.support.subsidy.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.dto.user.UserLoginDto;
import kr.go.support.subsidy.dto.user.UserJoinDto;
import kr.go.support.subsidy.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import kr.go.support.subsidy.service.AccountService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AccountController {

    private final AccountService accountService;

    //회원가입(Public)
    @PostMapping("/join/public")
    public ResponseApi<?> join(
            @Valid @RequestBody UserJoinDto dto){

        try{
            accountService.join(dto);
            return ResponseApi.success();
        }
        catch (IllegalArgumentException e) {

            return ResponseApi.error("400", e.getMessage());
        }

    }

    //로그인(Public)
    @PostMapping("/login/public")
    public ResponseApi<SessionUser> login(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletRequest request){
        try {
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

            return ResponseApi.success(sessionUser);

        } catch (IllegalArgumentException e) {
            return ResponseApi.error("401", e.getMessage());
        }
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseApi<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if(session != null) {
            session.invalidate();
        }
        return ResponseApi.success();
    }

    //계정조회(Admin)
    @GetMapping("/admin")
    public ResponseApi<List<UserResponseDto>> getUsers(){

        List<UserResponseDto> response = accountService.getUsers();
        return ResponseApi.success(response);
    }

    //계정삭제(Admin)
    @DeleteMapping("/admin")
    public ResponseApi<Void> deleteUser(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        accountService.deleteUser(sessionUser.getId());
        return ResponseApi.success();
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
