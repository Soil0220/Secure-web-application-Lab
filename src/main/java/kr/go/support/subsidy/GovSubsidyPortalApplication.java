package kr.go.support.subsidy;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.TimeZone;

@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class GovSubsidyPortalApplication {
    //TODO HTTPS 설정
    //TODO 패스워드 제한 로직 추가 및 일정횟수 실패시 계정잠김 기능 구현
    //TODO 관리자, 유저 페이지 취소버튼 추가

    @PostConstruct
    public void init() {
        // JVM의 기본 타임존을 UTC로 고정
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GovSubsidyPortalApplication.class, args);
    }

}
