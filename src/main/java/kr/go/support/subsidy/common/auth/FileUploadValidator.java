package kr.go.support.subsidy.common.auth;

import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import org.apache.tika.Tika;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Set;

@Component
public class FileUploadValidator {

    /*안전한 버전(필요한 서류만 화이트리스트 방식으로 허용, Path Traversal 검증)
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png");

    private static final Set<String> ALLOWED_MIME_TYPES =
            Set.of("image/jpeg", "image/png");
    */

    /*취약한 버전(불필요한 파일까지 허용, Path Traversal 검증 누락)*/
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "md", "txt");

    private static final Set<String> ALLOWED_MIME_TYPES =
            Set.of("image/jpeg", "image/png", "text/markdown", "text/plain");



    private final Tika tika = new Tika();

    public void validate(MultipartFile file) {

        // 파일 존재 검증
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }

        // 파일명 존재 검증
        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BusinessException(ErrorCode.FILE_NAME_NOT_FOUND);
        }

        /*
        // Path Traversal 검증 안전한버전 (경로패턴 제거)
        String filename = Paths.get(originalFilename)
                .getFileName()
                .toString();

        if (!filename.equals(originalFilename)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_NAME);
        }

        String extension = getExtension(filename);
        */

        // Path Traversal 검증 취약한 버전 (경로패턴 제거없음, 원본 파일명 그대로 사용)
        String extension = getExtension(originalFilename);


        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BusinessException(ErrorCode.INVALID_FILE_EXTENSION);
        }

        // 클라이언트가 전달한 MIME Type 검증
        String contentType = file.getContentType();

        if (contentType == null ||
                !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException(ErrorCode.INVALID_CONTENT_TYPE);
        }

        // 실제 파일 내용 기반 매직 바이트 검사
        validateActualFileType(file);
    }

    private void validateActualFileType(MultipartFile file) {

        // 끝나면 데이터 스트림 자동 닫기
        try (InputStream inputStream = file.getInputStream()) {

            String detectedType = tika.detect(inputStream);

            if (detectedType == null ||
                    !ALLOWED_MIME_TYPES.contains(detectedType.toLowerCase())) {
                throw new BusinessException(ErrorCode.INVALID_ACTUAL_FILE_TYPE);
            }

        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_TYPE_CHECK_FAILED);
        }
    }

    private String getExtension(String filename) {

        int index = filename.lastIndexOf('.');

        // .이 없거나 마지막에 존재
        if (index == -1 || index == filename.length() - 1) {
            throw new BusinessException(ErrorCode.INVALID_FILE_EXTENSION);
        }

        // 확장자 출력
        return filename
                .substring(index + 1)
                .toLowerCase();
    }
}