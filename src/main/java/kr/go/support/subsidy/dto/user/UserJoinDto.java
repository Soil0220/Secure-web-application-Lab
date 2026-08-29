package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;

public record UserJoinDto (
        @NotBlank
        @Size(min=4, max = 20)
        String username,

        @NotBlank
        @Size(min=8, max = 64)
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*+=-]).{8,}$",
                message = "비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.")
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
    public User toEntity(String encodedPassword) {
        return User.builder()
                .username(username)
                .password(encodedPassword)
                .name(name)
                .email(email)
                .phone(phone)
                .role(Role.USER)
                .build();
    }
}
