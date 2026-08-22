package kr.go.support.subsidy.dto.inquiry;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import kr.go.support.subsidy.domain.inquiry.Inquiry;
import kr.go.support.subsidy.domain.inquiry.InquiryStatus;
import kr.go.support.subsidy.domain.user.User;

public record InquiryRequestDto (
    @NotBlank
    @Size(max = 200)
    String title,

    @NotBlank
    String content,

    @NotBlank
    @Size(max = 2048)
    String link

) {
    public Inquiry toEntity(User user) {
        return Inquiry.builder()
                .user(user)
                .title(title)
                .content(content)
                .link(link)
                .status(InquiryStatus.PENDING)
                .build();
    }
}

//세션의 유저id로 User조회 후 문의생성