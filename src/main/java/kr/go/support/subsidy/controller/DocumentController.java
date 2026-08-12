package kr.go.support.subsidy.controller;

import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.dto.document.DocumentCreateDto;
import kr.go.support.subsidy.dto.document.DocumentDownloadDto;
import kr.go.support.subsidy.dto.document.DocumentResponseDto;
import kr.go.support.subsidy.dto.user.UserResponseDto;
import kr.go.support.subsidy.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/document")
public class DocumentController {

    private final DocumentService documentService;

    //유저별 서류 조회
    @GetMapping
    public ResponseApi<List<DocumentResponseDto>> getDocuments(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

            List<DocumentResponseDto> response = documentService.getDocuments(sessionUser.getId());
            return ResponseApi.success(response);
    }

    //서류 등록
    @PostMapping
    public ResponseApi<Long> createDocument(
            @Valid @ModelAttribute DocumentCreateDto dto,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        Long response = documentService.createDocument(sessionUser.getId(), dto);
        return ResponseApi.success(response);
    }

    //서류 삭제
    @DeleteMapping("/{documentId}")
    public ResponseApi<Long> deleteDocument(
            @PathVariable Long documentId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        Long response = documentService.deleteDocument(sessionUser.getId(), documentId);
        return ResponseApi.success(response);
    }

    //서류 다운로드
    @GetMapping("/{documentId}")
    public ResponseEntity<Resource> downloadDocument(
            @PathVariable Long documentId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        DocumentDownloadDto downloadDto = documentService.downloadDocument(sessionUser.getId(), documentId);

        // 한글,특수문자 파일명 인코딩
        String encodedFileName = UriUtils.encode(downloadDto.originFileName(), StandardCharsets.UTF_8);

        // HTTP 헤더 설정 (Content-Disposition 브라우저가 다운로드 창을 띄우도록 명령)
        String contentDisposition = "attachment; filename=\"" + encodedFileName + "\"";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // 모든 파일 형식을 바이너리로 안전하게 전송
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(downloadDto.resource());
    }
}
