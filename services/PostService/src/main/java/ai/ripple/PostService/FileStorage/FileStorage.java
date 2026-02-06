package ai.ripple.PostService.FileStorage;


import org.springframework.web.multipart.MultipartFile;

public interface FileStorage {
    String uploadFile(MultipartFile file, String folder);
}

