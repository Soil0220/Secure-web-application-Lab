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
import java.util.Optional;


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
    public void join(UserJoinDto joinDto) {

        boolean duplicate = userRepository.existsByEmailOrUsername(joinDto.email(), joinDto.username());

        //계정 중복
        if (duplicate) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL_USERNAME);
        }

        userRepository.save(joinDto.toEntity());

        /* 보안상 복구기능이 없는게 좋을거같지만 필요하다면 고려해보기
        Optional<User> optionalUser = userRepository.findByEmailIncludingDeleted(joinDto.email());

        //기존 계정 있음(삭제여부 무관)
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // 활성 : 중복오류
            if (!user.isDeleted()) {
                throw new BusinessException(ErrorCode.DUPLICATE_USERNAME);
            } else { // 비활성 : 계정복구절차 진행
                user.restore(joinDto);
                return SignUpType.RESTORED;
            }
        }
        //기존 계정 없음
        userRepository.save(joinDto.toEntity());
        return SignUpType.CREATED;
        */
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
