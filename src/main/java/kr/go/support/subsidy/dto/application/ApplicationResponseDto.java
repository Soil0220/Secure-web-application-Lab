package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;

import java.time.Instant;

public record ApplicationResponseDto (
        Long applicationId,
        String username,
        String title,
        ApplicationStatus status,
        Instant createdAt
){
    public static  ApplicationResponseDto from(Application application){
        return new ApplicationResponseDto(
            application.getId(),
            application.getUser().getUsername(),
            application.getGrant().getTitle(),
            application.getStatus(),
            application.getCreatedAt()
        );
    }
}
