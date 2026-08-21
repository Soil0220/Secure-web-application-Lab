package kr.go.support.subsidy.common;

import kr.go.support.subsidy.common.auth.FileUploadValidator;
import kr.go.support.subsidy.common.exception.BusinessException;
import kr.go.support.subsidy.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileManager {

    @Value("${app.fileManager.uploadDir}")
    private String uploadDir;

    private final FileUploadValidator fileUploadValidator;

    // 절대 경로 가져오기
    public Path getFullPath(String storeFileName) {

        //업로드 폴더 경로
        Path uploadBasePath = Paths.get(uploadDir).toAbsolutePath().normalize();

        //상위경로 이동, 혹은 절대경로 할당시 경로 문제 발생
        Path targetPath = uploadBasePath.resolve(storeFileName).normalize();

        return targetPath;
    }

    /*
    //파일저장(안전한 버전, 업로드 파일 검증시 필요한 서류만 화이트리스트로 설정, UUID로 파일명 변경 저장)
    public String storeFile(MultipartFile multipartFile) {

        //파일 검증
        fileUploadValidator.validate(multipartFile);

        String originalFilename = multipartFile.getOriginalFilename();
        String storeFileName = createStoreFileName(originalFilename);

        try {
            // 저장할 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장 (물리적 이관)
            File dest = new File(getFullPath(storeFileName).toString());
            multipartFile.transferTo(dest);
            return storeFileName; // DB 저장용 난수화된 파일명 반환

        } catch (IOException e) {
            throw new IllegalArgumentException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }
    */

    //파일저장(취약한 버전, 업로드 파일 검증시 불필요한 파일 허용, 파일명 예측가능하게 변경없이 저장)
    public String storeFile(MultipartFile multipartFile) {

        //파일 검증
        fileUploadValidator.validate(multipartFile);

        String originalFilename = multipartFile.getOriginalFilename();

        try {
            // 저장할 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장 (물리적 이관)
            File dest = new File(getFullPath(originalFilename).toString());
            multipartFile.transferTo(dest);
            return originalFilename;

        } catch (IOException e) {
            throw new IllegalArgumentException("파일 저장 중 오류가 발생했습니다.", e);
        }
    }


    //파일삭제
    public boolean deleteFile(String storeFileName) {
        if (storeFileName == null || storeFileName.isBlank()) {
            return false;
        }

        File file = new File(getFullPath(storeFileName).toString());
        if (file.exists()) {
            return file.delete(); // 정상 삭제 시 true
        }
        return false;
    }

    //리소스 반환
    public Resource getResource(String storeFileName){

        // 로컬에 저장된 파일명으로 절대경로 변환 후 해당 파일 반환
        Path filePath = getFullPath(storeFileName);
        try {
            Resource resource = new UrlResource(filePath.toUri());

            // 디스크 내 실제 파일 존재 및 읽기 가능 여부 검증
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(ErrorCode.DOCUMENT_FILE_NOT_FOUND);
            }

            return resource;
        } catch (MalformedURLException e){
            throw new BusinessException(ErrorCode.INVALID_FILE_URL, e);
        }
    }



    // 파일명 중복 방지를 위한 UUID 생성 (예: uuid_originalName.ext)
    private String createStoreFileName(String originalFilename) {
        String ext = extractExt(originalFilename);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + ext;
    }

    // 확장자 추출
    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        if (pos == -1) {
            return "";
        }
        return originalFilename.substring(pos + 1);
    }
}