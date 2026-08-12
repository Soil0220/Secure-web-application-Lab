package kr.go.support.subsidy.controller;

import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.dto.favorite.FavoriteResponseDto;
import kr.go.support.subsidy.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/favorite")
public class FavoriteController {

    private final FavoriteService favoriteService;

    //유저별 즐겨찾기한 지원금 제도 조회
    @GetMapping
    public ResponseApi<List<FavoriteResponseDto>> getFavorites(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        List<FavoriteResponseDto> response = favoriteService.getFavorites(sessionUser.getId());
        return ResponseApi.success(response);
    }

    //지원금 제도 즐겨찾기 설정
    @PostMapping("/{grantId}")
    public ResponseApi<Long> createFavorite(
            @PathVariable Long grantId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        Long response = favoriteService.createFavorite(sessionUser.getId(), grantId);
        return ResponseApi.success(response);
    }

    //지원금 제도 즐겨찾기 해제
    @DeleteMapping("/{grantId}")
    public ResponseApi<Long> deleteFavorite(
            @PathVariable Long grantId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser
    ){
        Long response = favoriteService.deleteFavorite(sessionUser.getId(), grantId);
        return ResponseApi.success(response);
    }
}
