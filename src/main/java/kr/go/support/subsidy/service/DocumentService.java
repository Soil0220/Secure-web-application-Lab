package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.FileManager;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocument;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocumentRepository;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentRepository;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.document.DocumentCreateDto;
import kr.go.support.subsidy.dto.document.DocumentDownloadDto;
import kr.go.support.subsidy.dto.document.DocumentResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final FileManager fileManager;
    private final ApplicationDocumentRepository applicationDocumentRepository;

    //유저별 서류 조회
    public List<DocumentResponseDto> getDocuments(Long userId) {

        List<DocumentResponseDto> result = documentRepository.findByUserId(userId).stream()
                        .map(DocumentResponseDto::from)
                        .toList();

        return result;
    }


    //서류 등록
    @Transactional
    public Long createDocument(Long userId, DocumentCreateDto dto){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        //파일 로컬 저장
        String originFileName = dto.file().getOriginalFilename();

        String storeFileName = fileManager.storeFile(dto.file());


        //파일 DB 저장(origin 파일명으로 저장, storeFileName은 url에 포함)
        Document document = dto.toEntity(user, originFileName, storeFileName, dto.file().getSize());
        documentRepository.save(document);

        return document.getId();
    }

    //서류 삭제
    @Transactional
    public Long deleteDocument(Long userId, Long documentId ){
        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DOCUMENT_NOT_FOUND));

        //소프트 삭제 정책으로 인해 로컬파일은 제외하고 DB만 삭제처리
        document.delete();
        return documentId;
    }

    //서류 다운로드
    public DocumentDownloadDto downloadDocument(Long userId, Long documentId) {

        Document document = documentRepository.findByIdAndUserId(documentId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DOCUMENT_NOT_FOUND));

            // 물리 파일 자원(Resource) 읽기
            Resource resource = fileManager.getResource(document.getStoreFileName());

            // 파일 자원과 원본 파일명을 DTO로 묶어 반환
            return new DocumentDownloadDto(resource, document.getOriginFileName());
    }

    //신청서 서류 다운로드(Admin)
    public DocumentDownloadDto downloadApplicationDocument(Long applicationDocumentId) {

        ApplicationDocument applicationDocument = applicationDocumentRepository.findById(applicationDocumentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DOCUMENT_NOT_FOUND));

        // 물리 파일 자원(Resource) 읽기
        Resource resource = fileManager.getResource(applicationDocument.getStoreFileName());

        // 파일 자원과 원본 파일명을 DTO로 묶어 반환
        return new DocumentDownloadDto(resource, applicationDocument.getOriginFileName());
    }

}
