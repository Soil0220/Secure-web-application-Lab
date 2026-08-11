package kr.go.support.subsidy.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.go.support.subsidy.domain.document.Document;

public record DocumentResponseDto (
        Long documentId,
        String originFileName
){
    public static DocumentResponseDto from(Document document)
    {
        return new DocumentResponseDto(
          document.getId(),
          document.getOriginFileName()
        );
    }
}
