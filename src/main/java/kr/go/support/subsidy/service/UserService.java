package kr.go.support.subsidy.service;

import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.notice.NoticeResponseDto;
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
public class UserService {
    private final UserRepository userRepository;

    //로그인
    public User login(UserLoginDto userLoginDto)
    {
        User user = userRepository.findByUsername(userLoginDto.username())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        if(!user.getPassword().equals(userLoginDto.password())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }

    //회원가입
    @Transactional
    public long join(UserJoinDto joinDto) {
        if (userRepository.existsByUsername(joinDto.username())) {
            throw new IllegalArgumentException("동일한 아이디가 이미 존재합니다.");
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
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));
        user.delete();
    }
}
