package kr.go.support.subsidy.common.auth;

import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class Initializer {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    private final StringRedisTemplate redisTemplate;


    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    //30분마다 초기화
    @Scheduled(fixedRate = 600000)
    public void resetSystem() {


        // Redis 초기화
        try {
            redisTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
        } catch (Exception e) {
            log.error("[Redis] 초기화 실패", e);
        }

        // MySQL 전체 테이블 비우기
        try {
            // 외래키 제약조건 종료
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0;");

            // 현재 데이터베이스의 모든 테이블 이름 가져오기
            List<String> tableNames = jdbcTemplate.queryForList(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()",
                    String.class
            );

            // 각 테이블 비우기
            for (String tableName : tableNames) {
                jdbcTemplate.execute("TRUNCATE TABLE `" + tableName + "`;");
            }

            // 외래키 제약조건 다시 켜기
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1;");

        } catch (Exception e) {
            log.error("[DB] 초기화 실패", e);
        }

        createAdmin();
    }

    //어드민 계정 생성
    private void createAdmin(){
        boolean hasAdmin = userRepository.existsByRole(Role.ADMIN);

        //어드민 계정 존재
        if(hasAdmin){return;}

        User user =  User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .name("관리자")
                .email("Admin@google.com")
                .phone("01012345678")
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);
    }

}
