package kr.go.support.subsidy.common;

import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;
import lombok.Getter;

import java.io.Serializable;

//세션저장을 위핸 세션객체의 Serializable상속

@Getter
public class SessionUser implements Serializable {
    private Long id;
    private String name;
    private Role role;

    public SessionUser(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.role = user.getRole();
    }
}
