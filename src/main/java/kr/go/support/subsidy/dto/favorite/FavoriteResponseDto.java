package kr.go.support.subsidy.dto.favorite;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.favorite.Favorite;
import kr.go.support.subsidy.domain.grant.GrantCycle;
import kr.go.support.subsidy.domain.grant.GrantStatus;

import java.time.Instant;
import java.time.LocalDate;

public record FavoriteResponseDto (
        Long grantId,
        String title,
        String content,
        Long amount,
        GrantCycle cycle,
        Instant startDate,
        Instant endDate,
        GrantStatus status
){
    public static FavoriteResponseDto from(Favorite favorite){
        return new FavoriteResponseDto(
                favorite.getGrant().getId(),
                favorite.getGrant().getTitle(),
                favorite.getGrant().getContent(),
                favorite.getGrant().getAmount(),
                favorite.getGrant().getCycle(),
                favorite.getGrant().getStartDate(),
                favorite.getGrant().getEndDate(),
                favorite.getGrant().getStatus()
        );
    }
}
