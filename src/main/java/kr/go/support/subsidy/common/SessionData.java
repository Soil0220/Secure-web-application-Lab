package kr.go.support.subsidy.common;

import lombok.Getter;

@Getter
public class SessionData {
    private SessionUser sessionUser;
    private Long lastExtendedTime;

    public SessionData(SessionUser sessionUser, Long lastExtendedTime){
        this.sessionUser = sessionUser;
        this.lastExtendedTime = lastExtendedTime;
    }
}
