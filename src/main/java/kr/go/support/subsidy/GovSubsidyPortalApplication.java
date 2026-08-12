package kr.go.support.subsidy;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

import java.util.TimeZone;

@EnableJpaAuditing
@EnableAsync
@SpringBootApplication
public class GovSubsidyPortalApplication {
    //TODO 파일 입력값 MIME, 확장자 등 입력값 검증 및 실행방지
    //TODO XSS 공격 방어를 위한 입력값 검증
    //TODO HTTPS 설정
    //TODO 세션과 CSRF 타임아웃 설정하기
    @PostConstruct
    public void init() {
        // JVM의 기본 타임존을 UTC로 고정
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GovSubsidyPortalApplication.class, args);
    }

}
