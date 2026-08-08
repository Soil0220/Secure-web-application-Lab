package kr.go.support.subsidy.domain.log;


import kr.go.support.subsidy.dto.log.LogRequestDto;
import kr.go.support.subsidy.service.LogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RequestLogEventListener {

    private final LogService logService;

    @Async
    @EventListener
    public void handleRequestLogEvent(LogRequestDto dto) {
        try {
            logService.createLog(dto);
        } catch (Exception e) {
            log.error("Request log save failed", e);
        }
    }
}