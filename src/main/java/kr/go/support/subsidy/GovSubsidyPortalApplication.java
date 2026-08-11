package kr.go.support.subsidy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class GovSubsidyPortalApplication {
    //TODO 프로젝트 전체의 시간기준 및 포멧 표준화 필요
    //TODO 컨트롤러 응답 재조정 필요
    //TODO 파일 입력값 MIME, 확장자 등 입력값 검증 및 실행방지
    //TODO CSRF 공격 방어를 위한 DoubleSubmitCookie필터 설정
    //TODO XSS 공격 방어를 위한 입력값 검증
    //TODO HTTPS 설정(인증서 필요)
    public static void main(String[] args) {
        SpringApplication.run(GovSubsidyPortalApplication.class, args);
    }

}
