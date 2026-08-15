package kr.go.support.subsidy.dto.inquiry;

import java.time.Instant;

public record InquiryAnswerResponseDto (
        String answer,
        Instant answeredAt
){}
