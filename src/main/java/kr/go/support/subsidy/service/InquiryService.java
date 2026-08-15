package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.inquiry.InquiryRepository;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.inquiry.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    //유저별 문의 조회
    public List<InquiryResponseDto> getInquiries(Long userId){
        List<InquiryResponseDto> result = inquiryRepository.findByUserIdWithUser(userId).stream()
                .map(InquiryResponseDto::from)
                .toList();
        return result;
    }

    //모든 문의 조회(admin)
    public List<InquiryResponseDto> getAllInquiries(){
        List<InquiryResponseDto> result = inquiryRepository.findAllWithUser().stream()
                .map(InquiryResponseDto::from)
                .toList();
        return result;
    }

    //문의 등록
    @Transactional
    public Long createInquiry(Long userId, InquiryRequestDto dto){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Inquiry inquiry = dto.toEntity(user);
        return inquiryRepository.save(inquiry).getId();
    }

    //문의 수정
    @Transactional
    public Long updateInquiry(Long userId, Long inquiryId, InquiryUpdateDto dto){
        Inquiry inquiry = inquiryRepository.findByIdAndUserId(inquiryId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INQUIRY_NOT_FOUND));

        inquiry.update(dto);
        return inquiryId;
    }

    //문의 삭제
    @Transactional
    public Long deleteInquiry(Long userId, Long inquiryId){

        Inquiry inquiry = inquiryRepository.findByIdAndUserId(inquiryId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INQUIRY_NOT_FOUND));

        inquiry.delete();
        return inquiryId;
    }

    //문의 답변(Admin)
    @Transactional
    public InquiryAnswerResponseDto updateInquiry(Long inquryId, InquiryAnswerDto dto){
        Inquiry inquiry = inquiryRepository.findById(inquryId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INQUIRY_NOT_FOUND));

        inquiry.reply(dto.answer());
        return  new InquiryAnswerResponseDto(inquiry.getAnswer(), inquiry.getAnsweredAt());
    }

}