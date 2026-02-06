package ai.ripple.PostService.FileStorage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "local")
public class LocalFileStorageService implements FileStorage {

    @Value("${local.upload-dir}")
    private String uploadDir;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            Path dirPath = Paths.get(uploadDir + folder);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = dirPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            return "/uploads" + folder + "/" + filename;    // changed 

        } catch (IOException e) {
            throw new RuntimeException("Local upload failed", e);
        }
    }
}
