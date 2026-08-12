package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.notice.Notice;
import kr.go.support.subsidy.domain.notice.NoticeRepository;
import kr.go.support.subsidy.dto.notice.NoticeCreateDto;
import kr.go.support.subsidy.dto.notice.NoticeResponseDto;
import kr.go.support.subsidy.dto.notice.NoticeUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private  final NoticeRepository noticeRepository;

    //공지사항 조회
    public List<NoticeResponseDto> getNotices(){
        List<NoticeResponseDto> result = noticeRepository.findAllByOrderByIsPinnedDescCreatedAtDesc().stream()
                .map(NoticeResponseDto::from)
                .toList();

        return result;
    }

    //공지사항 등록(Admin)
    @Transactional
    public Long createNotice(NoticeCreateDto dto) {
        Notice notice = dto.toEntity();
        return noticeRepository.save(notice).getId();
    }

    //공지사항 수정(Admin)
    @Transactional
    public Long updateNotice(Long noticeId, NoticeUpdateDto dto){
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTICE_NOT_FOUND));

        notice.update(dto);
        return noticeId;
    }

    //공지사항 삭제(Admin)
    @Transactional
    public Long deleteNotice(Long noticeId){
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.NOTICE_NOT_FOUND));

        notice.delete();
        return noticeId;
    }
}

