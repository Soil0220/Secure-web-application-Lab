package kr.go.support.subsidy.dto.document;

import org.springframework.core.io.Resource;

public record DocumentDownloadDto(
        Resource resource,
        String originFileName
) {}