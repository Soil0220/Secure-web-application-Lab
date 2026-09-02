package kr.go.support.subsidy;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

import java.util.TimeZone;

@EnableJpaAuditing
@EnableAsync
@EnableScheduling
@EnableRedisHttpSession
@SpringBootApplication
public class GovSubsidyPortalApplication {
    //TODO HTTPS 설정
    //TODO 계정정보 수정시 비밀번호 재인증

    @PostConstruct
    public void init() {
        // JVM의 기본 타임존을 UTC로 고정
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GovSubsidyPortalApplication.class, args);
    }

}
