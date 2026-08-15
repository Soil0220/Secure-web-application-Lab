package kr.go.support.subsidy.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;
import kr.go.support.subsidy.domain.document.Document;

import java.time.Instant;
import java.util.List;

public record ApplicationResponseDto (
        Long applicationId,
        String username,
        String title,
        ApplicationStatus status,
        Instant createdAt,
        List<DocumentInfo> documents
){
    public record DocumentInfo(
            Long documentId,
            String originFilename
    ){}

    public static  ApplicationResponseDto from(Application application){
        return new ApplicationResponseDto(
            application.getId(),
            //fetch로 가져왔기에 지연로딩 없음
            application.getUser().getUsername(),
            application.getGrant().getTitle(),
            application.getStatus(),
            application.getCreatedAt(),
                //지연로딩 발생, default_batch_fetch_size설정으로 묶어서 DB요청
                application.getDocuments().stream()
                        .map(appDoc -> new DocumentInfo(appDoc.getId(), appDoc.getOriginFileName()))
                        .toList()
        );
    }
}
