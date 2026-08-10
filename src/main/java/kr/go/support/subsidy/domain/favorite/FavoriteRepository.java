package kr.go.support.subsidy.domain.favorite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    Optional<Favorite> findByUserIdAndGrantId(Long userId, Long grantId);
    List<Favorite> findByGrantId(Long grantId);
}

//유저별 즐겨찾기한 지원금 등록, 유저별 즐겨찾기한 지원금 제거, 유저별 즐겨찾기 목록 조회