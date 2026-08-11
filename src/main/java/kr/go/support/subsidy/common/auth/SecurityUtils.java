package kr.go.support.subsidy.common.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    //스프링 시큐리티 암호 컴포넌트 활용
    private final BytesKeyGenerator csrfBytesKeyGenerator;
    private final PasswordEncoder passwordEncoder;

    // 32바이트 Base64 난수 생성
    public String generateSecureToken() {
        byte[] key = csrfBytesKeyGenerator.generateKey();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(key);
    }

    // 비밀번호 해시화
    public String encrypt(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    // 비밀번호 검증
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

}
