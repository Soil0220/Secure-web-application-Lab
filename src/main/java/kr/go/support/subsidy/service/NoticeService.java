package kr.go.support.subsidy.service;

import kr.go.support.subsidy.domain.notice.Notice;
import kr.go.support.subsidy.domain.notice.NoticeRepository;
import kr.go.support.subsidy.dto.notice.NoticeCreateDto;
import kr.go.support.subsidy.dto.notice.NoticeResponseDto;
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

    //공지사항 삭제(Admin)
    @Transactional
    public void deleteNotice(Long noticeId){
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));

        notice.delete();
    }
}

