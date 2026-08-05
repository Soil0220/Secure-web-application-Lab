package kr.go.support.subsidy.dto.user;

import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;

public record UserResponseDto (
        String name,
        String email,
        String phone,
        String bankName,
        String accountNum,
        Role role
){
    public static UserResponseDto from(User user){
        return new UserResponseDto(
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getBankName(),
                user.getAccountNum(),
                user.getRole()
        );
    }
}
