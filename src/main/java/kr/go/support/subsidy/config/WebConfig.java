package kr.go.support.subsidy.config;

import kr.go.support.subsidy.Interceptor.RequestTracingInterceptor;
import kr.go.support.subsidy.Interceptor.SessionCheckInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final RequestTracingInterceptor requestTracingInterceptor;
    private final SessionCheckInterceptor sessionCheckInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestTracingInterceptor)
            .order(1).addPathPatterns("/**");

        registry.addInterceptor(sessionCheckInterceptor)
                .order(2).addPathPatterns("/api/**");
    }
}
