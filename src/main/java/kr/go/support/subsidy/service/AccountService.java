package kr.go.support.subsidy.service;

import kr.go.support.subsidy.common.auth.LoginRateLimit;
import kr.go.support.subsidy.common.auth.SecurityUtils;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import kr.go.support.subsidy.domain.application.Application;
import kr.go.support.subsidy.domain.application.ApplicationRepository;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocument;
import kr.go.support.subsidy.domain.applicationDocument.ApplicationDocumentRepository;
import kr.go.support.subsidy.domain.document.Document;
import kr.go.support.subsidy.domain.document.DocumentRepository;
import kr.go.support.subsidy.domain.favorite.Favorite;
import kr.go.support.subsidy.domain.favorite.FavoriteRepository;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.inquiry.InquiryRepository;
import kr.go.support.subsidy.domain.user.Role;
import kr.go.support.subsidy.domain.user.User;
import kr.go.support.subsidy.domain.user.UserRepository;
import kr.go.support.subsidy.dto.user.UserBankAccountDto;
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
    private final FavoriteRepository favoriteRepository;
    private final ApplicationRepository applicationRepository;
    private final InquiryRepository inquiryRepository;
    private final DocumentRepository documentRepository;
    private final SecurityUtils securityUtils;
    private final ApplicationDocumentRepository applicationDocumentRepository;
    private final LoginRateLimit loginRateLimit;

    //로그인
    public User login(UserLoginDto userLoginDto, String clientIp)
    {
        //잠김여부 체크
        loginRateLimit.checkRateLimit(clientIp, userLoginDto.username());

        User user = userRepository.findByUsername(userLoginDto.username())
                .orElseGet(() -> {
                    loginRateLimit.recordFailure(clientIp, userLoginDto.username());
                    throw new BusinessException(ErrorCode.LOGIN_FAILED);
                });

        if(!securityUtils.matches(userLoginDto.password(), user.getPassword())) {
            loginRateLimit.recordFailure(clientIp, userLoginDto.username());
            throw new BusinessException(ErrorCode.LOGIN_FAILED);
        }

        loginRateLimit.resetFailures(clientIp, userLoginDto.username());
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

        String encodedPassword = securityUtils.encrypt(joinDto.password());
        userRepository.save(joinDto.toEntity(encodedPassword));

    }
    //은행계좌 설정
    @Transactional
    public Long setBankAccount(Long userId, UserBankAccountDto dto){

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.updateAccount(dto.bankName(), dto.accountNum());
        return userId;
    }

    //본인 계정조회
    public UserResponseDto getUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        return UserResponseDto.from(user);
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
    public Long deleteUser(Long userId){
        //User 계정만 제거 가능
        User user = userRepository.findByIdAndRole(userId, Role.USER)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        //User 삭제로부터  DB 무결성 유지를 위한 연쇄 Soft Delete
        user.delete();

        //favorite
        favoriteRepository.findByUserId(userId).forEach(Favorite::delete);
        //application
        applicationRepository.findByUserId(userId).forEach(Application::delete);
        //inquiry
        inquiryRepository.findByUserId(userId).forEach(Inquiry::delete);
        //document
        documentRepository.findByUserId(userId).forEach(Document::delete);
        //applicationDocument
        applicationDocumentRepository.findByUserId(userId).forEach(ApplicationDocument::delete);
        return userId;
    }

    //계정 권한 변경(Admin)
    @Transactional
    public void updateRole(Long userId, Role role){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.updateRole(role);
    }

}
