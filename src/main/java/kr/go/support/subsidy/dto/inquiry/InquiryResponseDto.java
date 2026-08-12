package kr.go.support.subsidy.dto.inquiry;

import jakarta.persistence.Column;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.inquiry.InquiryStatus;

import java.time.Instant;
import java.time.LocalDateTime;

public record InquiryResponseDto (
    Long inquiryId,
    String title,
    String content,
    InquiryStatus status,
    String answer,
    Instant answeredAt

){
    public static InquiryResponseDto from(Inquiry inquiry){
        return new InquiryResponseDto(
                inquiry.getId(),
                inquiry.getTitle(),
                inquiry.getContent(),
                inquiry.getStatus(),
                inquiry.getAnswer(),
                inquiry.getAnsweredAt()
        );
    }
}