package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationRepository;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantRepository;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.application.ApplicationResponseDto;
import kr.go.support.subsidy.dto.application.ApplicationUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final GrantRepository grantRepository;
    private final UserRepository userRepository;

    //유저별 지원금 조회
    public List<ApplicationResponseDto> getApplications(Long userId) {

        List<ApplicationResponseDto> result = applicationRepository.findByUserId(userId).stream()
                .map(ApplicationResponseDto::from)
                .toList();

        return result;
    }

    //지원금 신청
    @Transactional
    public Long createApplication(Long grantId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Grant grant = grantRepository.findById(grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));

        Application application = Application.toEntity(user, grant);
        return applicationRepository.save(application).getId();
    }

    //지원금 신청취소
    @Transactional
    public void cancelApplication(Long userId, Long grantId ){
        Application application = applicationRepository.findByUserIdAndGrantId(userId, grantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLICATION_NOT_FOUND));
        application.delete();
    }

    //지원금 신청 상태 갱신(Admin)
    @Transactional
    public Long updateApplication(Long applicationId, ApplicationUpdateDto dto){
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLICATION_NOT_FOUND));

        application.updateApplicationStatus(dto.status());

        return application.getId();
    }

}
