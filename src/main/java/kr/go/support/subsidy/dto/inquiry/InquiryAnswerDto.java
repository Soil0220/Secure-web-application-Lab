package kr.go.support.subsidy.dto.inquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InquiryAnswerDto (

        @NotNull
        Long inquiryId,

        @NotBlank
        String answer
) { }

//세션의 유저 id로 관리자인지 확인, inquiryId에 해당하는 행이 있는지 확인, answer로 답변처리