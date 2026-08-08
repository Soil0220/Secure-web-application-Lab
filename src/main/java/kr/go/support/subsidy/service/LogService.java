package kr.go.support.subsidy.service;

import kr.go.support.subsidy.domain.log.LogRepository;
import kr.go.support.subsidy.dto.inquiry.InquiryResponseDto;
import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.dto.log.LogResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return logRepository.existsByRequestId(requestId);
    }
}
