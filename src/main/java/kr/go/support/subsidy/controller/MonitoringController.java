package kr.go.support.subsidy.controller;

import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.dto.log.LogResponseDto;
import kr.go.support.subsidy.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final LogService logService;

    //로그 조회
    @GetMapping("/admin")
    public ResponseApi<List<LogResponseDto>> getLogs(){
        List<LogResponseDto> response = logService.getLogs();

        return ResponseApi.success(response);
    }
}
