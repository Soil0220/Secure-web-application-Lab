package kr.go.support.subsidy.service;

import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.inquiry.InquiryRepository;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.inquiry.InquiryAnswerDto;
import kr.go.support.subsidy.dto.inquiry.InquiryRequestDto;
import kr.go.support.subsidy.dto.inquiry.InquiryResponseDto;
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
        List<InquiryResponseDto> result = inquiryRepository.findByUserId(userId).stream()
                .map(InquiryResponseDto::from)
                .toList();
        return result;
    }

    //문의 등록
    @Transactional
    public Long createInquiry(Long userId, InquiryRequestDto dto){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 유저가 존재하지 않습니다."));

        Inquiry inquiry = dto.toEntity(user);
        return inquiryRepository.save(inquiry).getId();
    }

    //문의 삭제
    @Transactional
    public void deleteInquiry(Long userId, Long inquiryId){

        Inquiry inquiry = inquiryRepository.findByIdAndUserId(inquiryId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 문의가 존재하지 않습니다."));

        inquiry.delete();
    }

    //문의 답변(Admin)
    @Transactional
    public Long updateInquiry(Long userId, InquiryAnswerDto dto){
        Inquiry inquiry = inquiryRepository.findByIdAndUserId(dto.inquiryId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 문의가 존재하지 않습니다."));

        inquiry.reply(dto.answer());
        return  dto.inquiryId();
    }

}