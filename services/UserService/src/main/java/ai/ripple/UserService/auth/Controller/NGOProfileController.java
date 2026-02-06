package ai.ripple.UserService.auth.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ai.ripple.UserService.auth.Dto.PasswordUpdateDTO;
import ai.ripple.UserService.auth.Dto.UpdateNGOProfileDTO;
import ai.ripple.UserService.auth.Dto.VerificationDocumentDTO;
import ai.ripple.UserService.auth.Entity.Account;
import ai.ripple.UserService.auth.Entity.Verification;
import ai.ripple.UserService.auth.Entity.VerificationStatus;
import ai.ripple.UserService.auth.FileStorage.FileStorage;
import ai.ripple.UserService.auth.Repository.AccountRepository;
import ai.ripple.UserService.auth.Repository.VerificationRepository;

import java.util.List;


@RestController
@RequestMapping("/auth/ngo/profile")
public class NGOProfileController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorage fileStorageService;

    // =====================================================
    // GET NGO PROFILE
    // =====================================================
    @GetMapping
    public ResponseEntity<Account> getProfile(
            @RequestAttribute("userId") String userId
    ) {
        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        return ResponseEntity.ok(ngo);
    }

    // =====================================================
    // UPDATE NGO PROFILE (name, phone, address, reg number)
    // =====================================================
    @PutMapping
    public ResponseEntity<Account> updateProfile(
            @RequestAttribute("userId") String userId,
            @RequestBody UpdateNGOProfileDTO dto
    ) {
        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (dto.getName() != null) ngo.setName(dto.getName());
        if (dto.getPhone() != null) ngo.setPhone(dto.getPhone());
        if (dto.getAddress() != null) ngo.setAddress(dto.getAddress());
        if (dto.getRegistrationNumber() != null)
            ngo.setRegistrationNumber(dto.getRegistrationNumber());

        return ResponseEntity.ok(accountRepository.save(ngo));
    }

    // =====================================================
    // SUBMIT / UPDATE VERIFICATION DOCUMENTS
    // =====================================================
    @PutMapping("/documents")
    public ResponseEntity<String> updateDocuments(
            @RequestAttribute("userId") String userId,
            @RequestBody VerificationDocumentDTO dto
    ) {
        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        List<Verification> existing =
                verificationRepository.findByNgoAndStatusNot(
                        ngo, VerificationStatus.Rejected
                );

        Verification verification = existing.isEmpty()
                ? new Verification()
                : existing.get(0);

        verification.setNgo(ngo);
        verification.setSubmittedDocs(dto.getSubmittedDocs());
        verification.setStatus(VerificationStatus.Pending);

        verificationRepository.save(verification);

        return ResponseEntity.ok("Documents submitted successfully");
    }

    // =====================================================
    // GET VERIFICATION STATUS
    // =====================================================
    @GetMapping("/verification")
    public ResponseEntity<?> getVerificationStatus(
            @RequestAttribute("userId") String userId
    ) {
        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        List<Verification> records = verificationRepository.findByNgo(ngo);

        return records.isEmpty()
                ? ResponseEntity.ok("No verification records found")
                : ResponseEntity.ok(records);
    }

    // =====================================================
    // UPDATE PROFILE PHOTO
    // =====================================================
    @PostMapping("/photo")
    public ResponseEntity<Account> updateProfilePhoto(
            @RequestAttribute("userId") String userId,
            @RequestParam("file") MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        String fileUrl = fileStorageService.uploadFile(
                file,
                "ripple/profile_photos"
        );

        ngo.setProfilePhotoUrl(fileUrl);
        return ResponseEntity.ok(accountRepository.save(ngo));
    }

    // =====================================================
    // UPDATE PASSWORD
    // =====================================================
    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(
            @RequestAttribute("userId") String userId,
            @RequestBody PasswordUpdateDTO dto
    ) {
        Account ngo = accountRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), ngo.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Old password incorrect");
        }

        ngo.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        accountRepository.save(ngo);

        return ResponseEntity.ok("Password updated successfully");
    }

    // =====================================================
    // DELETE NGO ACCOUNT
    // =====================================================
    @DeleteMapping
    public ResponseEntity<String> deleteAccount(
            @RequestAttribute("userId") String userId
    ) {
        accountRepository.deleteById(Long.valueOf(userId));
        return ResponseEntity.ok("NGO account deleted successfully");
    }
}

/*

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ai.ripple.UserService.auth.Entity.Account;
import ai.ripple.UserService.auth.Entity.Verification;
import ai.ripple.UserService.auth.Entity.VerificationStatus;
import ai.ripple.UserService.auth.FileStorage.FileStorage;
import ai.ripple.UserService.auth.Repository.AccountRepository;
import ai.ripple.UserService.auth.Repository.VerificationRepository;

import java.util.List;

@RestController
@RequestMapping("/auth/ngo/profile")
public class NGOProfileController {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private VerificationRepository verificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileStorage fileStorageService;

    // ---------------------------------------------
    // Get NGO profile
    // ---------------------------------------------
    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("X-User-Email") String email) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        return ResponseEntity.ok(ngo);
    }

    // ---------------------------------------------
    // Update NGO profile details
    // ---------------------------------------------
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestHeader("X-User-Email") String email,
                                           @RequestBody Account updatedData) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (updatedData.getName() != null) ngo.setName(updatedData.getName());
        if (updatedData.getPhone() != null) ngo.setPhone(updatedData.getPhone());
        if (updatedData.getAddress() != null) ngo.setAddress(updatedData.getAddress());
        if (updatedData.getRegistrationNumber() != null) ngo.setRegistrationNumber(updatedData.getRegistrationNumber());

        accountRepository.save(ngo);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // ---------------------------------------------
    // Submit or update verification documents
    // ---------------------------------------------
    @PutMapping("/documents")
    public ResponseEntity<?> updateDocuments(@RequestHeader("X-User-Email") String email,
                                             @RequestBody String submittedDocs) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        // Check for existing pending/verified record
        List<Verification> existing = verificationRepository.findByNgoAndStatusNot(ngo, VerificationStatus.Rejected);

        Verification verification;
        if (existing.isEmpty()) {
            verification = new Verification();
            verification.setNgo(ngo);
        } else {
            verification = existing.get(0);
        }

        verification.setSubmittedDocs(submittedDocs);
        verification.setStatus(VerificationStatus.Pending);

        verificationRepository.save(verification);
        return ResponseEntity.ok("Documents submitted successfully");
    }

    // ---------------------------------------------
    // Get own verification status
    // ---------------------------------------------
    @GetMapping("/verification")
    public ResponseEntity<?> getVerificationStatus(@RequestHeader("X-User-Email") String email) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        List<Verification> records = verificationRepository.findByNgo(ngo);
        if (records.isEmpty()) {
            return ResponseEntity.ok("No verification records found");
        }
        return ResponseEntity.ok(records);
    }

    // ---------------------------------------------
    // Update profile photo
    // ---------------------------------------------
    @PostMapping("/photo")
    public ResponseEntity<?> updateProfilePhoto(@RequestHeader("X-User-Email") String email,
                                                @RequestParam("file") MultipartFile file) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        if (file != null && !file.isEmpty()) {
            String fileUrl = fileStorageService.uploadFile(file, "profile_photos");
            ngo.setProfilePhotoUrl(fileUrl);
            accountRepository.save(ngo);
            return ResponseEntity.ok("Profile photo updated successfully");
        } else {
            return ResponseEntity.badRequest().body("No file provided");
        }
    }

    // ---------------------------------------------
    // Change password
    // ---------------------------------------------
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestHeader("X-User-Email") String email,
                                            @RequestBody String newPassword) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        ngo.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(ngo);
        return ResponseEntity.ok("Password updated successfully");
    }

    // ---------------------------------------------
    // Delete NGO account
    // ---------------------------------------------
    @DeleteMapping
    public ResponseEntity<?> deleteAccount(@RequestHeader("X-User-Email") String email) {
        Account ngo = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        accountRepository.delete(ngo);
        return ResponseEntity.ok("NGO account deleted successfully");
    }
}


*/