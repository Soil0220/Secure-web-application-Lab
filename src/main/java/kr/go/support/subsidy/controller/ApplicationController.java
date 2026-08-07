package kr.go.support.subsidy.controller;

import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationStatus;
import kr.go.support.subsidy.dto.application.ApplicationCreateDto;
import kr.go.support.subsidy.dto.application.ApplicationResponseDto;
import kr.go.support.subsidy.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/application")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApplicationController {

    private final ApplicationService applicationService;

    //유저별 지원금 신청 내역 조회
    @GetMapping
    public ResponseApi<List<ApplicationResponseDto>> getApplications(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        List<ApplicationResponseDto> response = applicationService.getApplications(sessionUser.getId());
        return ResponseApi.success(response);
    }

    // 지원금 신청
    @PostMapping
    public ResponseApi<Long> createApplication(
            @Valid @RequestBody ApplicationCreateDto dto,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        Long applicationId = applicationService.createApplication(dto, sessionUser.getId());
        return ResponseApi.success(applicationId);
    }

    //지원금 신청 취소
    @DeleteMapping("/{grantId}")
    public ResponseApi<Void> cancelApplication(
            @PathVariable Long grantId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        applicationService.cancelApplication(sessionUser.getId(), grantId);
        return ResponseApi.success();
    }

    //지원금 신청 상태 갱신
    @PatchMapping("/{grantId}/admin")
    public ResponseApi<Long> updateApplicationStatus(
            @PathVariable Long grantId,
            @RequestParam ApplicationStatus status,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        Long updatedId = applicationService.updateApplication(sessionUser.getId(), grantId, status);
        return ResponseApi.success(updatedId);
    }
}
