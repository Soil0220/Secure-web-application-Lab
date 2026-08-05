package kr.go.support.subsidy.dto.notice;

import kr.go.support.subsidy.domain.notice.Notice;

public record NoticeResponseDto (
    Long noticeId,
    String title,
    String content,
    boolean isPinned
){
    public static NoticeResponseDto from(Notice notice){
        return new NoticeResponseDto(
                notice.getId(),
                notice.getTitle(),
                notice.getContent(),
                notice.isPinned()
        );
    }
}
