package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;

public record UserJoinDto (
        @NotBlank
        String username,
        @NotBlank
        String password,
        @NotBlank
        String name,
        @NotBlank
        String email,
        @NotBlank
        String phone

) {
    public User toEntity() {
        return User.builder()
                .username(username)
                .password(password)
                .name(name)
                .email(email)
                .phone(phone)
                .role(Role.USER)
                .build();
    }
}

//회원가입을 통한 유저 생성