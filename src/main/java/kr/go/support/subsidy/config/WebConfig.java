package kr.go.support.subsidy.config;

import kr.go.support.subsidy.filter.RequestTracingfilter;
import kr.go.support.subsidy.filter.SessionCheckfilter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final RequestTracingfilter requestTracingfilter;
    private final SessionCheckfilter sessionCheckfilter;

    //CORS 필터 적용
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }

    //요청 검증
    @Bean
    public FilterRegistrationBean<RequestTracingfilter> tracingFilterRegistration() {
        FilterRegistrationBean<RequestTracingfilter> bean = new FilterRegistrationBean<>(requestTracingfilter);
        bean.addUrlPatterns("/api/**");
        bean.setOrder(1);
        return bean;
    }

    //세션 검증
    @Bean
    public FilterRegistrationBean<SessionCheckfilter> sessionFilterRegistration() {
        FilterRegistrationBean<SessionCheckfilter> bean = new FilterRegistrationBean<>(sessionCheckfilter);
        bean.addUrlPatterns("/api/**");
        bean.setOrder(2);
        return bean;
    }

    //CSRF 검증
}
