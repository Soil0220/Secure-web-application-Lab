package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;

public record UserJoinDto (
        @NotBlank
        @Size(min=4, max = 20)
        String username,

        @NotBlank
        @Size(min=8, max = 64)
        String password,

        @NotBlank
        @Size(min=2, max = 50)
        String name,

        @NotBlank
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(max = 20)
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