package kr.go.support.subsidy.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserBankAccountDto (
        @NotBlank
        @Size(max = 50)
        String bankName,

        @NotBlank
        @Size(max = 20)
        String accountNum
){}