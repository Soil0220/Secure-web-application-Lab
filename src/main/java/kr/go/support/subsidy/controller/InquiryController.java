package kr.go.support.subsidy.controller;


import jakarta.validation.Valid;
import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.common.SessionUser;
import kr.go.support.subsidy.dto.inquiry.InquiryAnswerDto;
import kr.go.support.subsidy.dto.inquiry.InquiryRequestDto;
import kr.go.support.subsidy.dto.inquiry.InquiryResponseDto;
import kr.go.support.subsidy.dto.inquiry.InquiryUpdateDto;
import kr.go.support.subsidy.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiry")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InquiryController {

    private final InquiryService inquiryService;

    //유저별 문의 조회
    @GetMapping
    public ResponseApi<List<InquiryResponseDto>>  getUserInquiries(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser){

        List<InquiryResponseDto> response = inquiryService.getInquiries(sessionUser.getId());
        return ResponseApi.success(response);
    }


    //문의 등록
    @PostMapping
    public ResponseApi<Long> createInquiry(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser,
            @Valid @RequestBody InquiryRequestDto dto){

        Long response = inquiryService.createInquiry(sessionUser.getId(), dto);
        return ResponseApi.success(response);
    }

    //문의 수정
    @PatchMapping("/{inquiryId}")
    public ResponseApi<Void> updateInquiry(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser,
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryUpdateDto dto
    ){
        inquiryService.updateInquiry(sessionUser.getId(), inquiryId, dto);
        return ResponseApi.success();
    }

    //문의 삭제
    @DeleteMapping("/{inquiryId}")
    public ResponseApi<Void> deleteInquiry(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser,
            @PathVariable Long inquiryId){

        inquiryService.deleteInquiry(sessionUser.getId(), inquiryId);
        return ResponseApi.success();
    }

    //문의 답변(Admin)
    @PatchMapping("/{inquiryId}/admin")
    public ResponseApi<Long> updateInquiry(
            @SessionAttribute(name = "loginUser") SessionUser sessionUser,
            @PathVariable Long inquiryId,
            @Valid @RequestBody InquiryAnswerDto dto){

        Long response = inquiryService.updateInquiry(sessionUser.getId(), inquiryId, dto);
        return ResponseApi.success(response);
    }
}
