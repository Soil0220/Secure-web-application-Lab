package kr.go.support.subsidy.domain.notice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByIsPinnedDescCreatedAtDesc();
}

//고정여부와 생성일자를 기반으로 오름차순으로 공지사항 조회, 생성, 삭제