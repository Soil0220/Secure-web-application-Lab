package kr.go.support.subsidy.common.auth;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class LoginRateLimit {

    private final StringRedisTemplate redisTemplate;

    private static final int MAX_ATTEMPTS = 5; // 5회 실패시 잠금처리
    private static final long LOCK_TIME_MINUTES = 15; // 잠금시간

    public LoginRateLimit(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private String getFailKey(String ip, String username) {
        return "login:fail:" + ip + ":" + username;
    }
    private String getBlockKey(String ip, String username) {
        return "login:block:" + ip + ":" + username;
    }

    // 잠김 여부 확인
    public void checkRateLimit(String ip, String username) {
        String blockKey = getBlockKey(ip, username);

        if (Boolean.TRUE.equals(redisTemplate.hasKey(blockKey))) {
            throw new BusinessException(ErrorCode.ACCOUNT_BLOCKED);
        }
    }

    // 로그인 실패시 카운트 증가 및 임계치 도달시 잠금
    public void recordFailure(String ip, String username) {
        String failKey = getFailKey(ip, username);

        // 실패 카운트 증가 및 10분 후 리셋(반복시 갱신)
        Long count = redisTemplate.opsForValue().increment(failKey);
        redisTemplate.expire(failKey, Duration.ofMinutes(LOCK_TIME_MINUTES));

        // 임계치 도달시 계정 잠금(반복시 갱신)
        if (count != null && count >= MAX_ATTEMPTS) {
            String blockKey = getBlockKey(ip, username);
            redisTemplate.opsForValue().set(blockKey, "LOCKED", Duration.ofMinutes(LOCK_TIME_MINUTES));

            // 실패 카운트 정리
            redisTemplate.delete(failKey);
        }
    }

    // 로그인 성공시 실패, 잠금 키 제거
    public void resetFailures(String ip, String username) {
        redisTemplate.delete(getFailKey(ip, username));
        redisTemplate.delete(getBlockKey(ip, username));
    }
}