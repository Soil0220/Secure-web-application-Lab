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
    //TODO 세션과 CSRF 타임아웃 설정하기

    /*시나리오
        [0. Reconnaissance]
        프론트 페이지의 주석에서 개발자의 실수로 DEV_NOTES라는 파일의 존재가 노출

        [1. Reconnaissance]
        IDOR 취약점을 통해 사용자 ID를 열거하고, 이를 기반으로 계정 정보를 수집하여 최상위 관리자 계정을 식별한다.
        → IDOR → 사용자 ID Enumeration → 최상위 관리자 계정 식별
        취약설정 : 부적절한 세션검증, URL에 UserId를 변경해가며 Account 페이지 접근 가능

        [2. Initial Access / Information Disclosure]
        파일 다운로드 기능을 이용하여 Path Traversal을 통해 application.yml 혹은 DEV_NOTES 파일에 접근하여 업로드 경로, 관리자API를 획득한다.
        → Path Traversal → 민감 파일 접근 → 업로드 경로 획득
        취약설정 : Path path = uploadDirectory.resolve(filename);
                 return new FileSystemResource(path);

        [3. Privilege Escalation]
        문의사항 기능에 Stored XSS Payload를 삽입하고 관리자가 해당 문의사항을 열람하도록 유도하여 관리자 브라우저에서 JavaScript를 실행한다.
        이를 통해 관리자 API를 실행시켜 관리자 권한을 확보한다.
        → 문의사항 Stored XSS → 관리자 페이지 방문 → 관리자 브라우저에서 JS 실행 → 2단계에서 얻은 관리자 권한 API 요청(세션제어) → 관리자 권한 획득
        취약설정 : 리액트에서 dangerouslySetInnerHTML 설정을 통한 Stored XSS 동작

        [4. Data Exfiltration]
        확보한 관리자 권한을 이용하여 지원자의 민감 서류에 접근하고, 정상적인 관리자 기능을 악용하여 다수의 지원자 정보를 다운로드함으로써 대량의 개인정보 및 민감정보를 유출한다.
        → 관리자 권한 획득 → 지원자 민감 서류 접근 → 서류 다운로드 → 대량 정보 유출
        취약설정 : 정부 지원금 사이트의 비지니스 로직상 자연스럽게 악용가능

        [5. Second-Order SQL Injection]
        악성 SQL Injection Payload를 로그 데이터에 삽입하여 저장한 후, 관리자의 로그 모니터링 기능을 이용하는 과정에서 저장된 데이터가 동적 SQL 구문에 재사용되도록 유도한다.
        이를 통해 Second-Order SQL Injection을 발생시키고 데이터베이스의 주요 데이터를 추출한다.
        → 악성 로그 데이터 저장 → 관리자 로그 모니터링 → 저장된 Payload의 동적 SQL 재사용 → Second-Order SQL Injection → DB 데이터 추출
        -취약설정 : JPA와 레포지토리를 기반으로 접근하면 문제없지만 로그 조회관련 부분은 사용자 입력값을 받아 SQL을 생성하여 실행하도록 설정시 취약하게 설정가능
    */
    @PostConstruct
    public void init() {
        // JVM의 기본 타임존을 UTC로 고정
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

    public static void main(String[] args) {
        SpringApplication.run(GovSubsidyPortalApplication.class, args);
    }

}
