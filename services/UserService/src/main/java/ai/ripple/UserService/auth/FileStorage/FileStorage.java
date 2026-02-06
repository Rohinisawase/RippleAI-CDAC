package ai.ripple.UserService.auth.FileStorage;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorage {
    String uploadFile(MultipartFile file, String folder);
}

