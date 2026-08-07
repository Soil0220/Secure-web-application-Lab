package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public record UserLoginDto(
        @NotBlank
        @Size(min=4, max = 20)
        String username,
        @NotBlank
        @Size(min=8, max = 64)
        String password
) {}

//단순 로그인 검증