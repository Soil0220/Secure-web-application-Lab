package kr.go.support.subsidy.common.auth;

import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String...args){

        boolean hasAdmin = userRepository.existsByRole(Role.ADMIN);

        //어드민 계정 존재
        if(hasAdmin){return;}

        User user =  User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .name("관리자")
                .email("Admin@google.com")
                .phone("010-1234-5678")
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

    }

}
