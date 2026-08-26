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

        Path targetPath = uploadBasePath.resolve(storeFileName).normalize();

        return targetPath;
    }

    /*
    //파일저장(안전한 버전, UUID로 파일명 변경 저장)
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

    // 파일명 중복 방지를 위한 UUID 생성
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

    */

    //파일저장(취약한 버전, 파일명 예측가능하게 변경없이 저장)
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

            File dest = new File(getFullPath(originalFilename).toString());

            /*
            1. 파일이 존재하지 않을때만 저장
            2. 개발자가 DocumentService의 파일 소유 검증 로직이 있다는 것을 통해 파일이 이미 존재한다는 것은 본인이 사전에 올린 파일이
            있다는 의미이기에 파일 덮어쓰기 없이 기존파일에 연결되도록 잘못된 로직을 작성했음
            3. 실제로는 파일명을 그대로 DB와 실제 물리파일 저장에 사용하기에 DB에 저장된 파일명과 실제 본인소유 물리파일 간의
            1:1 고유성 매칭이 사라져 ../DEVNOTES.md로 DB에 저장되고 파일소유 검증도 통과되지만 실제 다운로드 되는 파일은 본인소유가 아님
            */
            if (!dest.exists()) {
                multipartFile.transferTo(dest);}

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
}