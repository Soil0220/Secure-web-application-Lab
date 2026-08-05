package kr.go.support.subsidy.dto.favorite;

import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.favorite.Favorite;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.user.User;

public record FavoriteCreateDto (
        @NotNull
        Long grantId
) {
    public Favorite toEntity(User user, Grant grant) {
        return Favorite.builder()
                .user(user)
                .grant(grant)
                .build();
    }
}

//세션의 유저id와 grantId 존재하는지 검증후 Favorite생성