package kr.go.support.subsidy.dto.document;


import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentType;
import kr.go.support.subsidy.domain.user.User;
import org.springframework.web.multipart.MultipartFile;


public record DocumentCreateDto (

        @NotNull
        DocumentType docType,

        @NotNull
        MultipartFile file

) {
        public Document toEntity(User user, String originFileName, String storeFileName, Long fileSize, String filePath){
            return Document.builder()
                    .user(user)
                    .docType(docType)
                    .originFileName(originFileName)
                    .storeFileName(storeFileName)
                    .fileSize(fileSize)
                    .filePath(filePath)
                    .build();
        }
}

//세션의 유저ID와 파일네임 필터링 및 검증후 파일크기 계산해서 Document생성