package kr.go.support.subsidy.controller;

import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.dto.application.ApplicationCreateDto;
import kr.go.support.subsidy.dto.application.ApplicationResponseDto;
import kr.go.support.subsidy.dto.application.ApplicationUpdateDto;
import kr.go.support.subsidy.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/application")
public class ApplicationController {

    private final ApplicationService applicationService;

    //유저별 지원금 신청 내역 조회
    @GetMapping
    public ResponseApi<List<ApplicationResponseDto>> getApplications(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        List<ApplicationResponseDto> response = applicationService.getApplications(sessionUser.getId());
        return ResponseApi.success(response);
    }

    //전체 지원금 조회(Admin)
    @GetMapping("/admin")
    public ResponseApi<List<ApplicationResponseDto>> getAllApplications(){
        List<ApplicationResponseDto> response = applicationService.getAllApplications();
        return ResponseApi.success(response);
    }

    // 지원금 신청
    @PostMapping
    public ResponseApi<Long> createApplication(
            @Valid @RequestBody ApplicationCreateDto dto,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        Long response = applicationService.createApplication(sessionUser.getId(), dto);
        return ResponseApi.success(response);
    }

    //지원금 신청 취소
    @DeleteMapping("/{grantId}")
    public ResponseApi<Long> cancelApplication(
            @PathVariable Long grantId,
            @SessionAttribute(name = "loginUser") SessionUser sessionUser) {

        Long response = applicationService.cancelApplication(sessionUser.getId(), grantId);
        return ResponseApi.success(response);
    }

    //지원금 신청 상태 갱신(Admin)
    @PatchMapping("/{applicationId}/admin")
    public ResponseApi<Long> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationUpdateDto dto) {

        Long response = applicationService.updateApplication(applicationId, dto);
        return ResponseApi.success(response);
    }
}
