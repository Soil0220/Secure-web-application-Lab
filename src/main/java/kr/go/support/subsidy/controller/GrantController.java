package kr.go.support.subsidy.controller;

import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.dto.grant.GrantCreateDto;
import kr.go.support.subsidy.dto.grant.GrantResponseDto;
import kr.go.support.subsidy.dto.grant.GrantStatusUpdateDto;
import kr.go.support.subsidy.dto.grant.GrantUpdateDto;
import kr.go.support.subsidy.service.GrantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/grant")
public class GrantController {

    private final GrantService grantService;

    //지원금 제도 조회
    @GetMapping("/public")
    public ResponseApi<List<GrantResponseDto>> getGrants(){
        List<GrantResponseDto> response = grantService.getGrants();

        return ResponseApi.success(response);
    }


    //지원금 제도 등록(Admin)
    @PostMapping("/admin")
    public ResponseApi<Long> createGrant(
            @Valid @RequestBody GrantCreateDto dto){

        Long response = grantService.createGrant(dto);

        return ResponseApi.success(response);
    }

    //지원금 제도 수정(Admin)
    @PatchMapping("/update/{grantId}/admin")
    public ResponseApi<Long> updateGrant(
            @PathVariable Long grantId,
            @Valid @RequestBody GrantUpdateDto dto){
        Long response = grantService.updateGrant(grantId, dto);

        return ResponseApi.success(response);
    }

    //지원금 제도 상태 변경(Admin)
    @PatchMapping("/status/{grantId}/admin")
    public ResponseApi<Long> updateGrant(
            @PathVariable Long grantId,
            @Valid @RequestBody GrantStatusUpdateDto dto){
        Long response = grantService.updateGrantStatus(grantId, dto);

        return ResponseApi.success(response);
    }

    //지원금 제도 삭제(Admin)
    @DeleteMapping("/{grantId}/admin")
    public ResponseApi<Long> deleteGrant(
            @PathVariable Long grantId){

        Long response = grantService.deleteGrant(grantId);

        return ResponseApi.success(response);
    }
}
