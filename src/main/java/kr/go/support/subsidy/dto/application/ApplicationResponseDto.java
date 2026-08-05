package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;

public record ApplicationResponseDto (
        Long grantId,
        String title,
        ApplicationStatus status
){
    public static  ApplicationResponseDto from(Application application){
        return new ApplicationResponseDto(
            application.getGrant().getId(),
            application.getGrant().getTitle(),
            application.getStatus()
        );
    }
}
