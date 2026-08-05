package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.user.User;

public record ApplicationCreateDto(
        @NotNull
        Long grantId
) {
        public Application toEntity(User user, Grant grant) {
                return Application.builder()
                        .user(user)
                        .grant(grant)
                        .status(ApplicationStatus.SUBMITTED)
                        .build();
        }
}

//세션에서 유저의id 확인하고 User 조회 후 grantId로 Grant 가져와서 Application생성