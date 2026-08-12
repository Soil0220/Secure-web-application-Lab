package kr.go.support.subsidy.service;

import kr.go.support.subsidy.domain.log.LogRepository;
import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.dto.log.LogResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LogService {

    private final LogRepository logRepository;

    //로그 조회(Admin)
    public List<LogResponseDto> getLogs(){
        List<LogResponseDto> result = logRepository.findAll().stream()
                .map(LogResponseDto::from)
                .toList();
        return result;
    }

    //요청로그 저장(Event)
    @Transactional
    public void createLog(LogRequestDto dto){
        logRepository.save(dto.toEntity());
    }


    //요청 중복검사(Event)
    public boolean checkLog(String requestId){
        //TODO 추후 Redis 기반으로 유효시간동안의 RequestId 중복검사로 교체 필요
        return logRepository.existsByRequestId(requestId);
    }

    //요청 타임아웃 검사(최대 1분 차이 허용)
    public boolean checkTime(Instant requestTime){
        Instant now = Instant.now();
        long diffSeconds = Math.abs(Duration.between(requestTime, now).getSeconds());
        return diffSeconds > 60L;
    }
}
