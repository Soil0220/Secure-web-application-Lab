package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;


public record UserLoginDto(
        @NotBlank
        String username,
        @NotBlank
        String password
) {}

//단순 로그인 검증