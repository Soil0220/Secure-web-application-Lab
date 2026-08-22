package kr.go.support.subsidy.controller;

import kr.go.support.subsidy.common.ResponseApi;
import kr.go.support.subsidy.dto.log.LogResponseDto;
import kr.go.support.subsidy.dto.log.LogSearchDto;
import kr.go.support.subsidy.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/monitoring")
public class MonitoringController {

    private final LogService logService;

    //로그 조회
    @GetMapping("/admin")
    public ResponseApi<List<LogResponseDto>> getLogs(
            @RequestBody(required = false) LogSearchDto dto){
        List<LogResponseDto> response = logService.getLogs(dto);

        return ResponseApi.success(response);
    }
}
