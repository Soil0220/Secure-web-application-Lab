package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.favorite.Favorite;
import kr.go.support.subsidy.domain.favorite.FavoriteRepository;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantRepository;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.favorite.FavoriteResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final GrantRepository grantRepository;

    //유저별 즐겨찾기한 지원금 제도 조회
    public List<FavoriteResponseDto> getFavorites(Long userId) {
        List<FavoriteResponseDto> result = favoriteRepository.findByUserId(userId).stream()
                .map(FavoriteResponseDto::from)
                .toList();

        return result;
    }

    //지원금 제도 즐겨찾기 설정
    @Transactional
    public Long createFavorite(Long userId, Long grantId)
    {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));

        Favorite favorite = Favorite.toEntity(user, grant);
        return favoriteRepository.save(favorite).getId();
    }

    //지원금 제도 즐겨찾기 해제
    @Transactional
    public Long deleteFavorite(Long userId, Long grantId){
        Favorite favorite = favoriteRepository.findByUserIdAndGrantId(userId, grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FAVORITE_NOT_FOUND));

        favorite.delete();
        return favorite.getId();
    }
}