package ai.ripple.UserService.auth.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ai.ripple.UserService.auth.Dto.PasswordUpdateDTO;
import ai.ripple.UserService.auth.Dto.UpdateProfileDTO;
import ai.ripple.UserService.auth.Entity.Account;
import ai.ripple.UserService.auth.FileStorage.FileStorage;
import ai.ripple.UserService.auth.Repository.AccountRepository;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/auth/user/profile")
public class UserProfileController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorage fileStorageService;

    // =====================================================
    // GET PROFILE
    // =====================================================
    @GetMapping
    public ResponseEntity<Account> getProfile(
            @RequestAttribute("userId") String userId
    ) {
        log.info("Fetching profile for userId={}", userId);
        System.out.println("userId" + userId);
        Account user = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> {
                    log.error("User not found: userId={}", userId);
                    return new RuntimeException("User not found");
                });
        log.info("Profile fetched successfully for userId={}", userId);
        return ResponseEntity.ok(user);
    }

    // =====================================================
    // UPDATE PROFILE (name, phone, address)
    // =====================================================
    @PutMapping
    public ResponseEntity<Account> updateProfile(
            @RequestAttribute("userId") String userId,
            @RequestBody UpdateProfileDTO dto
    ) {
        log.info("Updating profile for userId={}", userId);
        Account user = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> {
                    log.error("User not found: userId={}", userId);
                    return new RuntimeException("User not found");
                });

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());

        Account updatedUser = accountRepository.save(user);
        log.info("Profile updated successfully for userId={}", userId);
        return ResponseEntity.ok(updatedUser);
    }

    // =====================================================
    // UPDATE PROFILE PHOTO
    // =====================================================
    @PostMapping("/photo")
    public ResponseEntity<Account> updateProfilePhoto(
            @RequestAttribute("userId") String userId,
            @RequestParam("file") MultipartFile file
    ) {
        log.info("Updating profile photo for userId={}", userId);

        if (file == null || file.isEmpty()) {
            log.warn("No file provided for userId={}", userId);
            return ResponseEntity.badRequest().build();
        }

        Account user = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> {
                    log.error("User not found: userId={}", userId);
                    return new RuntimeException("User not found");
                });

        String fileUrl = fileStorageService.uploadFile(
                file,
                "ripple/profile_photos"
        );
        user.setProfilePhotoUrl(fileUrl);

        Account updatedUser = accountRepository.save(user);
        log.info("Profile photo updated successfully for userId={}", userId);
        return ResponseEntity.ok(updatedUser);
    }

    // =====================================================
    // UPDATE PASSWORD
    // =====================================================
    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(
            @RequestAttribute("userId") String userId,
            @RequestBody PasswordUpdateDTO dto
    ) {
        log.info("Updating password for userId={}", userId);

        Account user = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> {
                    log.error("User not found: userId={}", userId);
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            log.warn("Old password incorrect for userId={}", userId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Old password incorrect");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        accountRepository.save(user);

        log.info("Password updated successfully for userId={}", userId);
        return ResponseEntity.ok("Password updated successfully");
    }

    // =====================================================
    // DELETE ACCOUNT
    // =====================================================
    @DeleteMapping
    public ResponseEntity<String> deleteAccount(
            @RequestAttribute("userId") String userId
    ) {
        log.info("Deleting account for userId={}", userId);
        accountRepository.deleteById(Long.valueOf(userId));
        log.info("Account deleted successfully for userId={}", userId);
        return ResponseEntity.ok("Account deleted successfully");
    }
}
