package kr.go.support.subsidy.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentType;

public record DocumentResponseDto (
        Long documentId,
        String originFileName,
        DocumentType docType
){
    public static DocumentResponseDto from(Document document)
    {
        return new DocumentResponseDto(
          document.getId(),
          document.getOriginFileName(),
          document.getDocType()
        );
    }
}
