package kr.go.support.subsidy.dto.notice;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.notice.Notice;


public record NoticeCreateDto(

    @NotBlank
    @Size(max = 200)
     String title,

    @NotBlank
     String content,

    @JsonProperty("isPinned")
     boolean isPinned
) {
     public Notice toEntity() {
          return Notice.builder()
                  .title(title)
                  .content(content)
                  .isPinned(isPinned)
                  .build();
     }
}

//공지사항 생성
