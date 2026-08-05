package kr.go.support.subsidy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

@Configuration
@EnableJpaAuditing(dateTimeProviderRef = "utcDateTimeProvider")
public class JpaConfig {

    @Bean
    public DateTimeProvider utcDateTimeProvider() {
        // @CreatedDate, @LastModifiedDate가 호출될 때 항상 UTC 기준 시각을 리턴
        return () -> Optional.of(OffsetDateTime.now(ZoneOffset.UTC).toLocalDateTime());
    }
}