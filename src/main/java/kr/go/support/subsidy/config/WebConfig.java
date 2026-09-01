package kr.go.support.subsidy.config;

import kr.go.support.subsidy.common.auth.SecurityUtils;
import kr.go.support.subsidy.filter.DoubleSubmitCookiefilter;
import kr.go.support.subsidy.filter.RequestTracingfilter;
import kr.go.support.subsidy.filter.SessionCheckfilter;
import kr.go.support.subsidy.service.LogService;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // 배포시 nginx를 거치기에 백엔드 자체의 외부포트는 닫혀있다.
    // 그래서 CORS 필터 적용은 필요 없지만 만약 외부포트를 열 경우에는 필요하다.
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:80");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    //요청 검증
    @Bean
    public FilterRegistrationBean<RequestTracingfilter> tracingFilterRegistration(
            LogService logService,
            ObjectMapper objectMapper,
            ApplicationEventPublisher eventPublisher
    ) {
        FilterRegistrationBean<RequestTracingfilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new RequestTracingfilter(logService, objectMapper, eventPublisher));
        bean.addUrlPatterns("/api/*");
        bean.setOrder(1);
        return bean;
    }


    //세션 검증
    @Bean
    public FilterRegistrationBean<SessionCheckfilter> sessionFilterRegistration(
            ObjectMapper objectMapper
    ) {
        FilterRegistrationBean<SessionCheckfilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new SessionCheckfilter(objectMapper));
        bean.addUrlPatterns("/api/*");
        bean.setOrder(2);
        return bean;
    }

    //CSRF 검증
    @Bean
    public FilterRegistrationBean<DoubleSubmitCookiefilter> csrfFilterRegistration(
            SecurityUtils securityUtils,
            ObjectMapper objectMapper
    ) {
        FilterRegistrationBean<DoubleSubmitCookiefilter> bean = new FilterRegistrationBean<>();
        bean.setFilter(new DoubleSubmitCookiefilter(securityUtils, objectMapper));
        bean.addUrlPatterns("/api/*");
        bean.setOrder(3);
        return bean;
    }

}