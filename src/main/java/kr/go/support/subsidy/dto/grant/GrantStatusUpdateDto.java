package kr.go.support.subsidy.dto.grant;

import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.grant.GrantStatus;

public record GrantStatusUpdateDto(

        @NotNull
        GrantStatus status
) {}

//grantId로 Grant가져온 후 상태변경 함수(status)로 변경