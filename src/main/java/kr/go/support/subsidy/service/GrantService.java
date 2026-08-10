package kr.go.support.subsidy.service;


import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationRepository;
import kr.go.support.subsidy.domain.favorite.Favorite;
import kr.go.support.subsidy.domain.favorite.FavoriteRepository;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantRepository;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.grant.GrantCreateDto;
import kr.go.support.subsidy.dto.grant.GrantResponseDto;
import kr.go.support.subsidy.dto.grant.GrantStatusUpdateDto;
import kr.go.support.subsidy.dto.grant.GrantUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GrantService {

    private final GrantRepository grantRepository;
    private final FavoriteRepository favoriteRepository;
    private final ApplicationRepository applicationRepository;

    //지원금 제도 조회
    public List<GrantResponseDto> getGrants() {
        List<GrantResponseDto> result = grantRepository.findAll().stream()
                .map(GrantResponseDto::from)
                .toList();

        return result;
    }

    //지원금 제도 등록(Admin)
    @Transactional
    public Long createGrant(GrantCreateDto dto) {
        Grant grant = dto.toEntity();
        return grantRepository.save(grant).getId();
    }

    //지원금 제도 수정(Admin)
    @Transactional
    public void updateGrant(Long grantId, GrantUpdateDto dto){
        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));
        grant.Update(dto);
    }

    //지원금 제도 삭제(Admin)
    @Transactional
    public void deleteGrant(Long grantId){
        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));

        //Grant 제거로부터  DB 무결성을 유지를 위한 연쇄 Soft Delete

        grant.delete();

        //favorite
        favoriteRepository.findByGrantId(grantId).forEach(Favorite::delete);

        //application
        applicationRepository.findByGrantId(grantId).forEach(Application::delete);
    }

    //지원금 제도 상태 변경
    @Transactional
    public Long updateGrantStatus(Long grantId, GrantStatusUpdateDto dto){
        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));

        grant.StatusUpdate(dto.status());

        return grantId;
    }
}