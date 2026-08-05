package kr.go.support.subsidy.dto.user;


import jakarta.validation.constraints.NotBlank;

public record UserBankAccountDto (
        @NotBlank
        String bankName,

        @NotBlank
        String accountNum
){}