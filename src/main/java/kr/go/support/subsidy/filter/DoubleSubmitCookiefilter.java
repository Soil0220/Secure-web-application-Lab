package kr.go.support.subsidy.filter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class DoubleSubmitCookiefilter extends OncePerRequestFilter {

}
