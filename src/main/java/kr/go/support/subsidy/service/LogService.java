package kr.go.support.subsidy.service;

import jakarta.persistence.EntityManager;
import kr.go.support.subsidy.domain.log.Log;
import kr.go.support.subsidy.domain.log.LogRepository;
import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.dto.log.LogResponseDto;
import kr.go.support.subsidy.dto.log.LogSearchDto;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
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
    private final EntityManager entityManager;

    //로그 조회(Admin)
    public List<LogResponseDto> getLogs(LogSearchDto dto){

        //전체 조회
        if(dto == null){
            List<LogResponseDto> result = logRepository.findAll().stream()
                    .map(LogResponseDto::from)
                    .toList();
            return result;
        }

        /*검색 조회(안전한 버전, 레포지토리를 이용)
        List<LogResponseDto> result = logRepository.findByApiUrlContainingIgnoreCase(dto.apiUrl()).stream()
                .map(LogResponseDto::from)
                .toList();
        return result;*/


        /*검색 조회(취약한 버전, 동적 SQL문 생성 실행)*/
        String sql = "SELECT * FROM request_logs WHERE api_url LIKE LOWER('%" + dto.apiUrl() + "%')";
        List<Log> result = entityManager.createNativeQuery(sql, Log.class).getResultList();

        return result.stream()
                .map(LogResponseDto::from)
                .toList();
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

    //TODO 단위별 로그요청 기능 추가필요 그 전까지는 테이블 비우기
    //10분 단위로 로그 테이블 비우기
    @Scheduled(fixedRate = 600000)
    @Transactional
    public void clearLogs() {
        logRepository.deleteAllInBatch();
    }
}
