package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationRepository;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocument;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocumentRepository;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentRepository;
import kr.go.support.subsidy.domain.grant.Grant;
import kr.go.support.subsidy.domain.grant.GrantRepository;
import kr.go.support.subsidy.domain.grant.GrantStatus;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.application.ApplicationCreateDto;
import kr.go.support.subsidy.dto.application.ApplicationResponseDto;
import kr.go.support.subsidy.dto.application.ApplicationUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final GrantRepository grantRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final ApplicationDocumentRepository applicationDocumentRepository;

    //유저별 지원금 조회
    public List<ApplicationResponseDto> getApplications(Long userId) {

        List<ApplicationResponseDto> result = applicationRepository.findByUserId(userId).stream()
                .map(ApplicationResponseDto::from)
                .toList();

        return result;
    }

    //전체 지원금 조회(Admin)
    public List<ApplicationResponseDto> getAllApplications() {

        List<ApplicationResponseDto> result = applicationRepository.findAllWithUserAndGrant().stream()
                .map(ApplicationResponseDto::from)
                .toList();

        return result;
    }

    //지원금 신청
    @Transactional
    public Long createApplication(Long userId, ApplicationCreateDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Grant grant = grantRepository.findById(dto.grantId())
                .orElseThrow(() -> new BusinessException(ErrorCode.GRANT_NOT_FOUND));

        List<Document> docs = documentRepository.findAllByIdInAndUserId(dto.documentIds(), userId);

        //Grant가 모집중일 때만 신청 가능
        if(grant.getStatus() != GrantStatus.RECRUITING){
            throw new BusinessException(ErrorCode.GRANT_NOT_RECRUITING);
        }

        //두 집합의 크기와 구성 요소가 완전히 일치하는지 검증
        Set<Long> foundIds = docs.stream()
                .map(Document::getId)
                .collect(Collectors.toSet());

        Set<Long> requestedIds = new HashSet<>(dto.documentIds());

        if (!foundIds.equals(requestedIds)) {
            throw new BusinessException(ErrorCode.DOCUMENT_NOT_FOUND);
        }

        //지원금 신청 저장
        Application application = Application.toEntity(user, grant);
        applicationRepository.save(application);

        //기존 유저별 서류 테이블에서 신청 대상이 되는 서류들 스냅샷 처리
        List<ApplicationDocument> submittedDocs = docs.stream()
                .map(doc -> ApplicationDocument.toEntity(user, application, doc))
                .toList();

        //지원금 신청서류 저장
        applicationDocumentRepository.saveAll(submittedDocs);

        return application.getId();
    }

    //지원금 신청취소
    @Transactional
    public Long cancelApplication(Long userId, Long applicationId ){

        Application application = applicationRepository.findByIdAndUserId(applicationId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPLICATION_NOT_FOUND));
        application.delete();

        //Application 삭제로부터  DB 무결성 유지를 위한 연쇄 Soft Delete

        //applicationDocument
        applicationDocumentRepository.findByUserId(userId).forEach(ApplicationDocument::delete);

        return application.getId();
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
