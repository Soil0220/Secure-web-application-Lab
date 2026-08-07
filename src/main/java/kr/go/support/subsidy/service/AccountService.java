package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.user.UserLoginDto;
import kr.go.support.subsidy.dto.user.UserJoinDto;
import kr.go.support.subsidy.dto.user.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {
    private final UserRepository userRepository;

    //로그인
    public User login(UserLoginDto userLoginDto)
    {
        User user = userRepository.findByUsername(userLoginDto.username())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(!user.getPassword().equals(userLoginDto.password())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        return user;
    }

    //회원가입
    @Transactional
    public long join(UserJoinDto joinDto) {
        if (userRepository.existsByUsername(joinDto.username())) {
            throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
        }

        User user = joinDto.toEntity();
        return userRepository.save(user).getId();
    }

    //계정조회(Admin)
    public List<UserResponseDto> getUsers(){
        List<UserResponseDto> result = userRepository.findAll().stream()
                .map(UserResponseDto::from)
                .toList();

        return result;
    }


    //계정삭제(Admin)
    @Transactional
    public void deleteUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.delete();
    }
}
