package kr.go.support.subsidy.service;


import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantRepository;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.grant.GrantCreateDto;
import kr.go.support.subsidy.dto.grant.GrantResponseDto;
import kr.go.support.subsidy.dto.grant.GrantStatusUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GrantService {

    private final GrantRepository grantRepository;
    private final UserRepository userRepository;

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

    //지원금 제도 삭제(Admin)
    @Transactional
    public void deleteGrant(Long grantId){
        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 지원금 제도가 존재하지 않습니다."));
        grant.delete();
    }

    //지원금 제도 상태 변경
    @Transactional
    public Long updateGrant(GrantStatusUpdateDto dto){
        Grant grant = grantRepository.findById(dto.grantId())
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 지원금 제도가 존재하지 않습니다."));

        grant.grantStatusUpdate(dto.status());

        return dto.grantId();
    }
}