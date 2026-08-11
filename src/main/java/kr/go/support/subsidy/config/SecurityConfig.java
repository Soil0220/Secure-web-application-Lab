package kr.go.support.subsidy.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public BytesKeyGenerator csrfBytesKeyGenerator() {
        return KeyGenerators.secureRandom(32);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())               // CSRF 비활성화
                .formLogin(form -> form.disable())     // HTML 로그인 페이지 리다이렉트 차단
                .httpBasic(basic -> basic.disable())    // HTTP Basic 인증 팝업 차단
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()                                   // 모든 API 요청을 인증 없이 허용
                );

        return http.build();
    }
}
