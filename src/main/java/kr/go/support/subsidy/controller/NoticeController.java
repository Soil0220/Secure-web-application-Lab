package kr.go.support.subsidy.controller;

import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.domain.notice.Notice;
import kr.go.support.subsidy.dto.notice.NoticeCreateDto;
import kr.go.support.subsidy.dto.notice.NoticeResponseDto;
import kr.go.support.subsidy.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NoticeController {
    private final NoticeService noticeService;

    //공지사항 조회(Public)
    @GetMapping("/public")
    public ResponseApi<List<NoticeResponseDto>> getNotices() {
        List<NoticeResponseDto> response = noticeService.getNotices();

        return ResponseApi.success(response);
    }

    //공지사항 등록(Admin)
    @PostMapping("/admin")
    public ResponseApi<Long> createNotice(
            @Valid @RequestBody NoticeCreateDto request) {

        Long response = noticeService.createNotice(request);
        return ResponseApi.success(response);
    }

    //공지사항 삭제(Admin)
    @DeleteMapping("/{noticeId}/admin")
    public ResponseApi<Void> deleteNotice(
            @PathVariable Long noticeId){

        noticeService.deleteNotice(noticeId);
        return ResponseApi.success();
    }
}
