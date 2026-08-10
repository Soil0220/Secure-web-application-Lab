package kr.go.support.subsidy.dto.notice;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NoticeUpdateDto (

        @NotBlank
        @Size(max = 200)
        String title,

        @NotBlank
        String content,

        @JsonProperty("isPinned")
        boolean isPinned
){}
